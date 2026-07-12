/**
 * Environment Variables Validator
 * Checks key variables and throws or warns based on NEXT_PUBLIC_APP_ENV.
 */

const REQUIRED_VARS = [
  'NEXT_PUBLIC_APP_ENV',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'FAST2SMS_API_KEY',
  'PHONEPE_SALT_KEY',
  'PHONEPE_SALT_INDEX'
];

export interface EnvValidationResult {
  valid: boolean;
  environment: string;
  missing: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const env = process.env.NEXT_PUBLIC_APP_ENV || 'development';
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const name of REQUIRED_VARS) {
    const value = process.env[name];
    if (!value || value.includes('placeholder') || value.includes('your-')) {
      if (env === 'production' || env === 'staging') {
        missing.push(name);
      } else {
        warnings.push(`${name} is missing or has a default placeholder value.`);
      }
    }
  }

  // Check storage keys
  const r2Vars = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];
  for (const name of r2Vars) {
    const value = process.env[name];
    if (!value || value.includes('placeholder') || value.includes('your-')) {
      warnings.push(`Cloudflare Storage R2 key [${name}] is not set. Local storage or fallbacks will be used.`);
    }
  }

  const isValid = missing.length === 0;

  if (!isValid) {
    console.error(`❌ CRITICAL ENV ERROR: Missing keys for environment "${env}":`, missing);
    if (env === 'production' || env === 'staging') {
      throw new Error(`CRITICAL ENVIRONMENT INITIALIZATION FAILED: Missing variables ${missing.join(', ')}`);
    }
  } else if (warnings.length > 0) {
    console.warn(`⚠️ Env Validation Warnings for environment "${env}":\n`, warnings.join('\n'));
  } else {
    console.log(`✅ Environment verification passed for: ${env}`);
  }

  return {
    valid: isValid,
    environment: env,
    missing,
    warnings
  };
}
