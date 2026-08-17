import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadEnv() {
  const envFile = path.join(root, '.env');
  if (!fs.existsSync(envFile)) return {};
  const env = {};
  fs.readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key) env[key] = value;
    });
  return env;
}

const env = loadEnv();
const projectId = env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'e9j72tow';
const dataset = env.SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;
const apiVersion = 'v2021-06-07';

if (!token) {
  console.error('SANITY_API_TOKEN is not set. Add it to .env or the environment.');
  process.exit(1);
}

const document = {
  _id: 'taxReport-2025',
  _type: 'taxReport',
  taxYear: '2025',
  availableDate: '2026-01-31',
  accountNumber: '85545454545455',
  forms: [
    {
      _key: 'form1',
      formType: '1099-INT',
      downloadUrl: '/1099/1099-INT-2025.pdf',
      description: 'Interest Income from Treasury securities and savings bonds',
    },
    {
      _key: 'form2',
      formType: '1099-DIV',
      downloadUrl: '/1099/1099-DIV-2025.pdf',
      description: 'Dividends and distributions from marketable securities',
    },
    {
      _key: 'form3',
      formType: '1099-B',
      downloadUrl: '/1099/1099-B-2025.pdf',
      description: 'Proceeds from broker and barter exchange transactions',
    },
    {
      _key: 'form4',
      formType: '1099-OID',
      downloadUrl: '/1099/1099-OID-2025.pdf',
      description: 'Original Issue Discount for Treasury bills and notes',
    },
  ],
  instructions: 'To access your 1099 forms:\n1. Log in to your TreasuryDirect account\n2. Click the "Manage Direct" tab\n3. Under "Manage My Taxes," click "Year 2025"\n4. Near the top of the "Taxable Transaction(s) Summary" page, click "View your 1099 for tax year 2025"',
  notes: [
    '1099s for tax year 2025 are available in your account now.',
    'If you have linked accounts (such as a minor account or where you converted paper bonds), each can have its own 1099.',
    'We place the 1099s by January 31 of the following year.',
    'When your 1099 is ready, we send an email to your personal email account and put a message into your InBox within TreasuryDirect.',
  ],
};

async function upsert() {
  const res = await fetch(`https://${projectId}.api.sanity.io/${apiVersion}/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: [{ createOrReplace: document }] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutation failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  console.log('Seeded taxReport document:', JSON.stringify(json));
}

async function main() {
  await upsert();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});