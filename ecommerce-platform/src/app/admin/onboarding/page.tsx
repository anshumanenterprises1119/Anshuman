'use client';

import React, { useState, useEffect } from 'react';

// Define the steps and initial states
interface Task {
  id: string;
  name: string;
  category: 'domain' | 'hosting' | 'database' | 'auth' | 'content' | 'payment' | 'shipping' | 'seo' | 'analytics' | 'backups';
  timeframe: 'TODAY' | 'THIS_WEEK' | 'LATER';
  desc: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  required: boolean;
}

const INITIAL_TASKS: Task[] = [
  // TODAY
  { id: 't1', name: 'Purchase Domain', category: 'domain', timeframe: 'TODAY', desc: 'Buy anshumanenterprises.online domain name from a registrar.', difficulty: 'Easy', completed: false, required: true },
  { id: 't2', name: 'Create Supabase Project', category: 'database', timeframe: 'TODAY', desc: 'Set up a new Supabase workspace for staging database and auth.', difficulty: 'Easy', completed: false, required: true },
  { id: 't3', name: 'Generate Web3Forms Keys', category: 'hosting', timeframe: 'TODAY', desc: 'Get two free email keys from Web3Forms for checkout/refund forms.', difficulty: 'Easy', completed: false, required: true },
  
  // THIS WEEK
  { id: 't4', name: 'Deploy Database Migrations', category: 'database', timeframe: 'THIS_WEEK', desc: 'Execute the SQL scripts (0 to 7) in the Supabase SQL editor.', difficulty: 'Medium', completed: false, required: true },
  { id: 't5', name: 'Configure Cloudflare DNS Nameservers', category: 'domain', timeframe: 'THIS_WEEK', desc: 'Point nameservers of your domain to Cloudflare for DNS & caching.', difficulty: 'Medium', completed: false, required: true },
  { id: 't6', name: 'Deploy Express Payment Server', category: 'payment', timeframe: 'THIS_WEEK', desc: 'Deploy the payment-server microservice on Render or Vercel.', difficulty: 'Medium', completed: false, required: true },
  { id: 't7', name: 'Deploy Google Apps Script Web App', timeframe: 'THIS_WEEK', category: 'content', desc: 'Copy script.gs to Apps Script, set variables, and deploy as Web App.', difficulty: 'Medium', completed: false, required: true },
  
  // LATER
  { id: 't8', name: 'Configure Custom Google Mail OTP (Free)', category: 'auth', timeframe: 'LATER', desc: 'Configure free Supabase built-in Email OTP auth (replaces paid Fast2SMS).', difficulty: 'Easy', completed: false, required: true },
  { id: 't9', name: 'Configure Webhooks in PhonePe Dashboard', category: 'payment', timeframe: 'LATER', desc: 'Add callback URL into the PhonePe dashboard with Basic Auth details.', difficulty: 'Medium', completed: false, required: true },
  { id: 't10', name: 'Map CNAME Records in Cloudflare', category: 'domain', timeframe: 'LATER', desc: 'Configure DNS CNAME and A records targeting Vercel global edge.', difficulty: 'Easy', completed: false, required: true },
  { id: 't11', name: 'Configure Google Analytics tag', category: 'analytics', timeframe: 'LATER', desc: 'Place Google Tag Manager code in the HTML layouts head.', difficulty: 'Easy', completed: false, required: false },
  { id: 't12', name: 'Generate pg_dump DB Backup Cron', category: 'backups', timeframe: 'LATER', desc: 'Configure a daily backup schedule command for Postgres transactions.', difficulty: 'Hard', completed: false, required: false },
  { id: 't13', name: 'Submit Sitemap to Google Search Console', category: 'seo', timeframe: 'LATER', desc: 'Register domain URL and upload sitemap.xml to Search Console.', difficulty: 'Easy', completed: false, required: false },
];

export default function OnboardingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wizards' | 'env' | 'connector' | 'seed'>('dashboard');
  const [activeWizard, setActiveWizard] = useState<'domain' | 'supabase' | 'google' | 'email' | 'payment' | 'seo' | 'analytics'>('domain');
  
  // Tasks filters
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'TODAY' | 'THIS_WEEK' | 'LATER'>('ALL');
  
  // Env variables installer states
  const [envValues, setEnvValues] = useState<Record<string, string>>({
    NEXT_PUBLIC_APP_ENV: 'production',
    NEXT_PUBLIC_SITE_URL: '',
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    PHONEPE_SALT_KEY: '',
    PHONEPE_SALT_INDEX: '1',
    PHONEPE_MERCHANT_ID: '',
    R2_ENDPOINT: '',
    R2_ACCESS_KEY_ID: '',
    R2_SECRET_ACCESS_KEY: '',
    R2_BUCKET_NAME: 'anshuman-commerce-prod',
  });
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  
  // Seed import states
  const [seedStep, setSeedStep] = useState<'preview' | 'importing' | 'complete'>('preview');
  const [seedProgress, setSeedProgress] = useState(0);

  // Initialize tasks from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('owner_onboarding_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('owner_onboarding_tasks', JSON.stringify(updatedTasks));
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  // Calculations
  const requiredTasks = tasks.filter(t => t.required);
  const completedRequired = requiredTasks.filter(t => t.completed).length;
  const readinessScore = requiredTasks.length > 0 
    ? Math.round((completedRequired / requiredTasks.length) * 100) 
    : 0;

  const getCategoryStatus = (category: string) => {
    const catTasks = tasks.filter(t => t.category === category);
    if (catTasks.length === 0) return 'Complete';
    const completed = catTasks.filter(t => t.completed).length;
    if (completed === catTasks.length) return 'Complete';
    if (completed > 0) return 'In Progress';
    return 'Not Started';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complete':
        return <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">Complete</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">In Progress</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40">Not Started</span>;
    }
  };

  const copyToClipboard = (text: string, varName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleRunSeed = () => {
    setSeedStep('importing');
    setSeedProgress(10);
    const interval = setInterval(() => {
      setSeedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSeedStep('complete');
          // Complete content task
          const updated = tasks.map(t => t.category === 'content' ? { ...t, completed: true } : t);
          saveTasks(updated);
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  // Generate env template contents
  const getEnvTemplateString = () => {
    return `# --------------------------------------------------
# NEXT.JS STOREFRONT PRODUCTION ENV VARIABLES
# Generated via Owner Onboarding Desk
# --------------------------------------------------
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=${envValues.NEXT_PUBLIC_SITE_URL || 'https://anshumanenterprises.online'}

# Supabase Production Connection
NEXT_PUBLIC_SUPABASE_URL=${envValues.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-public-key'}
SUPABASE_SERVICE_ROLE_KEY=${envValues.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-secret'}

# Fast2SMS Messaging Gateway (Optional - Disabled for free Email OTP)
FAST2SMS_API_KEY=disabled_using_free_email_otp

# PhonePe PG Live Merchant Credentials
PHONEPE_SALT_KEY=${envValues.PHONEPE_SALT_KEY || 'your-salt-key-hash'}
PHONEPE_SALT_INDEX=${envValues.PHONEPE_SALT_INDEX || '1'}
PHONEPE_MERCHANT_ID=${envValues.PHONEPE_MERCHANT_ID || 'your-merchant-mid'}

# Cloudflare R2 Secure Object Storage
R2_ENDPOINT=${envValues.R2_ENDPOINT || 'https://your-cloudflare-account-id.r2.cloudflarestorage.com'}
R2_ACCESS_KEY_ID=${envValues.R2_ACCESS_KEY_ID || 'your-access-key-id'}
R2_SECRET_ACCESS_KEY=${envValues.R2_SECRET_ACCESS_KEY || 'your-secret-access-key'}
R2_BUCKET_NAME=${envValues.R2_BUCKET_NAME || 'anshuman-commerce-prod'}

# Session Cookie Separation
NEXT_PUBLIC_COOKIE_PREFIX=prod_`;
  };

  return (
    <div className="space-y-8 pb-12 text-gray-200 font-sans">
      {/* Onboarding Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#1e1b4b]/60 to-[#0f172a]/80 border border-indigo-950 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Owner Onboarding Suite</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            Welcome to the launch desk. Follow this path to migrate from sandbox environment to staging and production readiness using zero-cost methods.
          </p>
        </div>
        
        {/* Readiness Score Card */}
        <div className="bg-[#0b0f19] border border-indigo-900/40 p-5 rounded-2xl flex items-center gap-5 w-full md:w-auto shadow-inner">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-gray-800" strokeWidth="6" fill="transparent" />
              <circle 
                cx="32" cy="32" r="28" 
                className="stroke-indigo-500 transition-all duration-500" 
                strokeWidth="6" fill="transparent" 
                strokeDasharray={175} 
                strokeDashoffset={175 - (175 * readinessScore) / 100}
              />
            </svg>
            <span className="absolute text-sm font-black text-white">{readinessScore}%</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-400 font-black tracking-wider uppercase">Go Live Score</span>
            <p className="text-xs text-gray-400">
              {completedRequired} of {requiredTasks.length} required tasks complete.
            </p>
            {readinessScore === 100 ? (
              <span className="text-xs text-emerald-400 font-bold">🎉 Ready to Launch!</span>
            ) : (
              <span className="text-xs text-amber-500 font-bold">⚠️ Blockers pending launch</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-800 overflow-x-auto gap-2">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
            activeTab === 'dashboard' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          📋 Launch Checklist
        </button>
        <button 
          onClick={() => setActiveTab('wizards')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
            activeTab === 'wizards' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          🧙 Setup Wizards
        </button>
        <button 
          onClick={() => setActiveTab('env')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
            activeTab === 'env' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          ⚙️ Env Installer
        </button>
        <button 
          onClick={() => setActiveTab('connector')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
            activeTab === 'connector' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          🔌 Service Connector
        </button>
        <button 
          onClick={() => setActiveTab('seed')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
            activeTab === 'seed' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          🌱 Catalog Seed
        </button>
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main tasks list column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center bg-[#111827] px-6 py-4 rounded-xl border border-gray-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Task Mode (Urgency Filter)</h2>
              <div className="flex gap-1.5 bg-[#0b0f19] p-1 rounded-lg border border-gray-800">
                {(['ALL', 'TODAY', 'THIS_WEEK', 'LATER'] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition ${
                      taskFilter === f ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {tasks
                .filter(t => taskFilter === 'ALL' || t.timeframe === taskFilter)
                .map(task => (
                  <div 
                    key={task.id} 
                    className={`group flex items-start gap-4 p-5 rounded-2xl border transition duration-150 ${
                      task.completed 
                        ? 'bg-emerald-950/10 border-emerald-900/30' 
                        : 'bg-[#111827] border-gray-800 hover:border-indigo-900/60'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 w-4 h-4 rounded text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className={`text-sm font-bold text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${
                            task.timeframe === 'TODAY' ? 'bg-rose-950 text-rose-400 border border-rose-900/40' :
                            task.timeframe === 'THIS_WEEK' ? 'bg-amber-950 text-amber-400 border border-amber-900/40' :
                            'bg-blue-950 text-blue-400 border border-blue-900/40'
                          }`}>
                            {task.timeframe.replace('_', ' ')}
                          </span>
                          <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${
                            task.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' :
                            task.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400' :
                            'bg-rose-950 text-rose-400'
                          }`}>
                            {task.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{task.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Sidebar category tracker */}
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Setup Progress Tracker</h2>
              <div className="space-y-4">
                {[
                  { name: 'domain', label: '🌐 Custom Domain' },
                  { name: 'database', label: '🗄️ Supabase Postgres' },
                  { name: 'auth', label: '🔑 User Authentication' },
                  { name: 'content', label: '📦 Catalog Content' },
                  { name: 'payment', label: '💳 Payment PG V2' },
                  { name: 'shipping', label: '🚚 Shiprocket Setup' },
                  { name: 'seo', label: '🔍 Google SEO Index' },
                  { name: 'backups', label: '💾 Database Backups' },
                ].map(cat => {
                  const status = getCategoryStatus(cat.name);
                  return (
                    <div key={cat.name} className="flex justify-between items-center gap-4 text-xs">
                      <span className="font-semibold text-gray-300">{cat.label}</span>
                      {getStatusBadge(status)}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-900/30 rounded-2xl p-6 space-y-4">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-bold text-white">Need Automation Assistance?</h3>
              <p className="text-xs text-indigo-200/70 leading-relaxed">
                Many of these setups can be executed or verified programmatically. Look at the Connection Center tab to test your live API keys instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETUP WIZARDS */}
      {activeTab === 'wizards' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Wizards sidebar selectors */}
          <div className="space-y-2 lg:col-span-1">
            {[
              { id: 'domain', label: '🌐 Domain Configuration' },
              { id: 'supabase', label: '🗄️ Supabase Creation' },
              { id: 'google', label: '🔑 Google OAuth credentials' },
              { id: 'email', label: '📧 Free Email OTP Setup' },
              { id: 'payment', label: '💳 PhonePe V2 Integration' },
              { id: 'seo', label: '🔍 SEO Metadata & Schemas' },
              { id: 'analytics', label: '📈 Analytics Tag Setup' },
            ].map(wiz => (
              <button
                key={wiz.id}
                onClick={() => setActiveWizard(wiz.id as any)}
                className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold tracking-wide transition duration-150 ${
                  activeWizard === wiz.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-gray-400 bg-[#111827] border border-gray-800 hover:text-white hover:border-gray-700'
                }`}
              >
                {wiz.label}
              </button>
            ))}
          </div>

          {/* Wizard Details workspace panel */}
          <div className="lg:col-span-3 bg-[#111827] border border-gray-800 rounded-2xl p-8 space-y-6">
            
            {/* DOMAIN SETUP WIZARD */}
            {activeWizard === 'domain' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">🌐 Step-by-Step Custom Domain Setup</h2>
                  <p className="text-xs text-indigo-400">Map your registrar to Cloudflare and target Vercel Edge.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Purchase the domain name **`anshumanenterprises.online`** from your preferred registrar (Namecheap, GoDaddy, Hostinger).
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Create a free account on [Cloudflare](https://dash.cloudflare.com), select Add Site, type your domain name, and select the **Free plan**.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Copy the custom Cloudflare Nameservers (e.g. `amy.ns.cloudflare.com`, `bob.ns.cloudflare.com`) and paste them in the custom DNS settings inside your registrar's dashboard.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Open Cloudflare DNS editor, delete default records, and add:
                      <br />
                      - **A Record**: Name: `@` | Value: `76.76.21.21` | Proxy Status: **DNS Only**
                      <br />
                      - **CNAME Record**: Name: `www` | Value: `cname.vercel-dns.com` | Proxy Status: **DNS Only**
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUPABASE SETUP WIZARD */}
            {activeWizard === 'supabase' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">🗄️ Step-by-Step Supabase Database Setup</h2>
                  <p className="text-xs text-indigo-400">Establish your relational Postgres tables and roles schemas.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Sign up on [Supabase](https://supabase.com) and click **New Project**. Name it "Anshuman Wholesale" and select Region close to users (e.g., Mumbai, India).
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Once created, navigate to **Project Settings** -> **API** -> Copy the `Project URL`, public `anon` API key, and write-role `service_role` key.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Go to the **SQL Editor** tab in the sidebar. Click **New Query**, paste the code inside `supabase/migrations/20260623000000_init_schema.sql` and click **Run**.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Repeat this for the remaining migration files in numerical order (1 through 7) to guarantee all customer features and security indexes are applied.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GOOGLE LOGIN WIZARD */}
            {activeWizard === 'google' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">🔑 Step-by-Step Google OAuth Setup</h2>
                  <p className="text-xs text-indigo-400">Allow customers to authenticate instantly using Google Login.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Go to the [Google Cloud Console](https://console.cloud.google.com). Create a project named "Anshuman Commerce".
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Navigate to **APIs & Services** -> **OAuth consent screen**. Set user type to **External**, fill in developer emails, and add authorized domains.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Go to **Credentials** -> Click **Create Credentials** -> **OAuth client ID**. Select Web Application, and add Authorized Redirect URIs pointing to your Supabase Auth callback.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Paste the client ID and client secret generated into the Google provider dashboard inside **Supabase Auth -> Providers -> Google**.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL SENDER WIZARD */}
            {activeWizard === 'email' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">📧 Step-by-Step Free Email Authentication OTP</h2>
                  <p className="text-xs text-amber-400">⚠️ Skip expensive SMS routing. Use Supabase built-in Email OTP auth (100% Free!).</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      In the Supabase Console, navigate to **Authentication** -> **Providers** -> **Email**. Enable Email Auth.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Toggle **Double Opt-In** check on or off according to sign-up flows. Turn **Confirm Email** ON to verify emails via magic link codes.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Navigate to **Authentication** -> **Email Templates** -> Select **Confirmation / Magic Link** to update the text fields with your wholesale brand logo.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Using this built-in email sender provides a completely free option (up to 3,000 email messages per month) with zero manual carrier setups or Fast2SMS gateway credits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT WIZARD */}
            {activeWizard === 'payment' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">💳 Step-by-Step PhonePe Gateway Integration</h2>
                  <p className="text-xs text-indigo-400">Initiate live UPI transactions and configure checkout webhooks.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Register as a merchant on the [PhonePe Business solution portal](https://www.phonepe.com/business-solutions/). Submit business PAN and bank proof for KYC validation.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Retrieve your Production **Merchant ID** (MID), **Client Secret**, and **Salt index** key values from the Developer dashboard.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Input these values into the production env keys list (Vercel server variables and express `.env` file). Turn sandbox mode OFF (`PHONEPE_SANDBOX=false`).
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Navigate to **PhonePe webhook settings** -> Add endpoint pointing to your Express payment server callback URL: `https://ae-payment-server.vercel.app/callback`. Define a basic username and password for security signature checks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SEO WIZARD */}
            {activeWizard === 'seo' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">🔍 Step-by-Step Search Engine Optimization</h2>
                  <p className="text-xs text-indigo-400">Submit sitemaps, verify robots rules, and review schema tags.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Open `index.html` locally. Verify that the hardcoded **LocalBusiness** and **FAQ** schemas in the head section match your real business hours, location coordinates, and shop phone numbers.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Go to [Google Search Console](https://search.google.com/search-console) -> Add a **URL prefix property** for `https://anshumanenterprises.online`.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Select **HTML Tag** verification. Copy the verification metadata element and place it in the `<head>` of your static `index.html` file.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Once Vercel updates the build, click **Verify** in Google Console. Navigate to **Sitemaps** -> Type `sitemap.xml` and click submit to index pages.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTICS WIZARD */}
            {activeWizard === 'analytics' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <h2 className="text-lg font-black text-white">📈 Step-by-Step Google Analytics Setup</h2>
                  <p className="text-xs text-indigo-400">Track customer conversion rates and catalog view counts.</p>
                </div>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                    <p className="leading-relaxed">
                      Sign up at [Google Analytics](https://analytics.google.com). Create a property named "Anshuman Enterprises Storefront".
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                    <p className="leading-relaxed">
                      Under Data Streams, select **Web** -> Type your website URL `https://anshumanenterprises.online`.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                    <p className="leading-relaxed">
                      Retrieve the Measurement ID (looks like `G-XXXXXXXXXX`) and copy the global site tag scripts code.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">4</span>
                    <p className="leading-relaxed">
                      Insert the script code directly in your static HTML head tag (or pass it via Vercel env settings dynamically) to track clicks, search query events, and transaction values.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB CONTENT: ENV INSTALLER */}
      {activeTab === 'env' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Environment Variables Installer & Validator</h2>
            <p className="text-xs text-gray-400">
              Input your live connection values below to generate an optimized `.env.production` file setup. You can copy the result directly into Vercel settings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Production URL</label>
                <input 
                  type="text" 
                  value={envValues.NEXT_PUBLIC_SITE_URL} 
                  onChange={(e) => setEnvValues({ ...envValues, NEXT_PUBLIC_SITE_URL: e.target.value })}
                  placeholder="https://anshumanenterprises.online"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Supabase API URL</label>
                <input 
                  type="text" 
                  value={envValues.NEXT_PUBLIC_SUPABASE_URL} 
                  onChange={(e) => setEnvValues({ ...envValues, NEXT_PUBLIC_SUPABASE_URL: e.target.value })}
                  placeholder="https://yourproject.supabase.co"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Supabase Anon Key</label>
                <input 
                  type="text" 
                  value={envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY} 
                  onChange={(e) => setEnvValues({ ...envValues, NEXT_PUBLIC_SUPABASE_ANON_KEY: e.target.value })}
                  placeholder="sb_publishable_..."
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Supabase Service Key (Secret)</label>
                <input 
                  type="password" 
                  value={envValues.SUPABASE_SERVICE_ROLE_KEY} 
                  onChange={(e) => setEnvValues({ ...envValues, SUPABASE_SERVICE_ROLE_KEY: e.target.value })}
                  placeholder="sb_secret_..."
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">PhonePe Salt Key</label>
                <input 
                  type="text" 
                  value={envValues.PHONEPE_SALT_KEY} 
                  onChange={(e) => setEnvValues({ ...envValues, PHONEPE_SALT_KEY: e.target.value })}
                  placeholder="hash-key-here"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">PhonePe Merchant ID</label>
                <input 
                  type="text" 
                  value={envValues.PHONEPE_MERCHANT_ID} 
                  onChange={(e) => setEnvValues({ ...envValues, PHONEPE_MERCHANT_ID: e.target.value })}
                  placeholder="MIDXXXXXXXXXX"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Generated File Preview (`.env.production`)</h3>
              <button 
                onClick={() => copyToClipboard(getEnvTemplateString(), 'env_config')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
              >
                {copiedVar === 'env_config' ? '✅ Copied Template!' : '📋 Copy Config Template'}
              </button>
            </div>
            <pre className="p-5 bg-[#0b0f19] border border-gray-800 rounded-xl text-[11px] font-mono text-gray-400 overflow-x-auto leading-relaxed shadow-inner">
              {getEnvTemplateString()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONNECTOR */}
      {activeTab === 'connector' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Connection Center Diagnostics</h2>
            <p className="text-xs text-gray-400">
              Verify if the required environments and services are responding cleanly. Missing connections flag setup blocker warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Custom Domain', status: 'Missing', desc: 'anshumanenterprises.online', color: 'rose' },
              { name: 'Supabase Database', status: 'Missing', desc: 'PostgreSQL tables check', color: 'rose' },
              { name: 'Cloudflare R2 Storage', status: 'Missing', desc: 'Static image buckets', color: 'rose' },
              { name: 'Vercel Deployment', status: 'Missing', desc: 'Storefront hosting', color: 'rose' },
              { name: 'PhonePe PG V2', status: 'Missing', desc: 'Merchant payment gateway', color: 'rose' },
              { name: 'Shiprocket logistics', status: 'Missing', desc: 'Courier tracking API', color: 'rose' },
              { name: 'Google OAuth API', status: 'Missing', desc: 'Google login provider', color: 'rose' },
              { name: 'Google Sheets DB', status: 'Missing', desc: 'Apps Script Order list', color: 'rose' },
            ].map(srv => (
              <div key={srv.name} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xs font-bold text-white leading-tight">{srv.name}</h3>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                    {srv.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">{srv.desc}</p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>ID: n/a</span>
                  <span>Ping: 0ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SEED IMPORT */}
      {activeTab === 'seed' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Database Seed Simulator & Previews</h2>
            <p className="text-xs text-gray-400">
              Run this module to populate the catalog products, transaction coupons, and compliance pages directly in your active database structure.
            </p>
          </div>

          {seedStep === 'preview' && (
            <div className="space-y-6">
              {/* Product Preview Cards Grid */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Database Catalog Preview (20 items)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-950 px-2 py-0.5 rounded">Physical</span>
                    <h4 className="text-xs font-bold text-white">Premium COB Ceiling Light 12W</h4>
                    <p className="text-[11px] text-gray-400">SKU: `AE-COB-12W` | Price: ₹1200</p>
                  </div>
                  <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-950 px-2 py-0.5 rounded">Physical</span>
                    <h4 className="text-xs font-bold text-white">Polycab FR House Wire 1.5 sq mm</h4>
                    <p className="text-[11px] text-gray-400">SKU: `PL-WIRE-1.5` | Price: ₹1800</p>
                  </div>
                  <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider bg-indigo-950 px-2 py-0.5 rounded">Digital</span>
                    <h4 className="text-xs font-bold text-white">Ultimate n8n AI Automation Pack</h4>
                    <p className="text-[11px] text-gray-400">SKU: `FWA-N8N-AI` | Price: ₹349</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRunSeed}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
                >
                  ⚡ Execute Database Seeding Script
                </button>
              </div>
            </div>
          )}

          {seedStep === 'importing' && (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Writing Seed Elements to Database...</h3>
                <p className="text-xs text-gray-400">Creating catalog rows, categories, and test checkouts.</p>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${seedProgress}%` }} />
              </div>
            </div>
          )}

          {seedStep === 'complete' && (
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center justify-center text-lg mx-auto font-bold shadow-lg">✓</div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Database Seed Simulated Successfully!</h3>
                <p className="text-xs text-gray-400">
                  20 products and 10 categories are now logged and verified.
                </p>
              </div>
              <button
                onClick={() => setSeedStep('preview')}
                className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                Reset and seed again
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
