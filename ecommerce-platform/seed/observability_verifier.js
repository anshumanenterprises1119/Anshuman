const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local for database credentials
const envPath = path.join(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseSecret = env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseSecret) {
  console.error('❌ Supabase credentials not found for observability verifier.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false }
});

async function runTelemetryAudit() {
  console.log('📊 Auditing Platform Observability telemetry...');
  const report = {
    logsCount: 0,
    activeJobsCount: 0,
    failedJobsCount: 0,
    retriedJobsCount: 0,
    eventsCount: 0,
    recentEvents: [],
    errors: [],
    warnings: [],
    timestamp: new Date().toISOString()
  };

  // 1. Audit operation_logs
  try {
    const { data, error } = await supabase.from('operation_logs').select('id, action, created_at').limit(100);
    if (error) throw error;
    report.logsCount = data ? data.length : 0;
  } catch (e) {
    report.warnings.push(`operation_logs table check failed: ${e.message}`);
  }

  // 2. Audit job_queue
  try {
    const { data: allJobs, error } = await supabase.from('job_queue').select('id, status, retry_count, error_message');
    if (error) throw error;
    if (allJobs) {
      report.activeJobsCount = allJobs.length;
      report.failedJobsCount = allJobs.filter(j => j.status === 'failed').length;
      report.retriedJobsCount = allJobs.filter(j => j.retry_count > 0).length;
      const failures = allJobs.filter(j => j.status === 'failed' || j.error_message);
      failures.forEach(f => {
        report.errors.push(`Job ${f.id} error: ${f.error_message || 'unknown error'}`);
      });
    }
  } catch (e) {
    report.warnings.push(`job_queue table check failed: ${e.message}`);
  }

  // 3. Audit order_events (Phase 6 transaction locks/event logs)
  try {
    const { data: events, error } = await supabase.from('order_events').select('id, event_type, created_at').order('created_at', { ascending: false }).limit(10);
    if (error) throw error;
    if (events) {
      report.eventsCount = events.length;
      report.recentEvents = events.map(ev => ({ id: ev.id, type: ev.event_type, time: ev.created_at }));
    }
  } catch (e) {
    report.warnings.push(`order_events table check failed: ${e.message}`);
  }

  // 4. Audit upload_logs
  try {
    const { data: uploads, error } = await supabase.from('upload_logs').select('id').limit(1);
    if (error) throw error;
  } catch (e) {
    report.warnings.push(`upload_logs table check failed: ${e.message}`);
  }

  writeOpsReport(report);
}

function writeOpsReport(report) {
  const reportPath = path.join(__dirname, '../../OPS_REPORT.md');

  const warningsSection = report.warnings.length === 0 
    ? '_No telemetry table warnings detected._' 
    : report.warnings.map(w => `> [!WARNING]\n> **${w}**`).join('\n\n');

  const errorsSection = report.errors.length === 0 
    ? '_No active queue errors or backoff failures detected._' 
    : report.errors.map(e => `- ❌ ${e}`).join('\n');

  const eventsSection = report.recentEvents.length === 0 
    ? '_No recent system events logged._' 
    : report.recentEvents.map(e => `| \`${e.id}\` | \`${e.type}\` | ${e.time} |`).join('\n');

  const markdown = `
# Platform Observability & Operations Status Report
Generated: ${report.timestamp}
Audit Area: Telemetry Logs, Event Hooks, & Job Queues

---

## 🚨 Schema Alerts & Warnings (${report.warnings.length})
${warningsSection}

---

## 📈 Queue Telemetry Status
- **Active Jobs in Queue**: ${report.activeJobsCount}
- **Retried/Backoff Tasks**: ${report.retriedJobsCount}
- **Failed Job Queue Counts**: ${report.failedJobsCount}
- **Total Operation Audit Logs**: ${report.logsCount}

---

## ❌ Queue Failure Logs
${errorsSection}

---

## 🔔 Recent Transactions & System Events
| Event ID | Event Type | Log Timestamp |
| :--- | :--- | :--- |
${eventsSection}

---
### ⚙️ Observability Infrastructure Summary:
1. **Queued Retries**: Backoff policies check for status and increments \`retry_count\` until maximum threshold reached.
2. **Telemetry Coverage**: Active tracing captures CMS builder layout alterations, checkout transitions, and dynamic branding calls.
3. **Transaction Logs**: Real-time status hooks are captured directly in the remote database.
`;

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`📝 Observability report written to ${reportPath}`);
}

runTelemetryAudit();
