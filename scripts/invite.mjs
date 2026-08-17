import fs from 'node:fs';
import os from 'node:os';
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

function loadCliToken() {
  const candidates = [
    process.env.SANITY_AUTH_TOKEN,
    path.join(os.homedir(), '.config', 'sanity', 'config.json'),
    path.join(os.homedir(), 'AppData', 'Roaming', 'sanity', 'config.json'),
    path.join(os.homedir(), 'Library', 'Application Support', 'sanity', 'config.json'),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (fs.existsSync(candidate)) {
      try {
        const config = JSON.parse(fs.readFileSync(candidate, 'utf8'));
        if (config.authToken) return config.authToken;
      } catch {
        // ignore unparseable config
      }
    }
  }
  return null;
}

const env = loadEnv();
const projectId = env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'e9j72tow';
const token = loadCliToken();
const email = process.argv[2];
const role = process.argv[3] || 'editor';

if (!token) {
  console.error('No admin auth token found. Run `npx sanity login` first.');
  process.exit(1);
}
if (!email) {
  console.error('Usage: node scripts/invite.mjs <email> [role]');
  console.error('  role defaults to "editor".');
  process.exit(1);
}

const url = `https://api.sanity.io/v2025-07-11/access/project/${projectId}/invites`;
const body = { email, role };

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Invite failed (${res.status}):`, text);
    process.exit(1);
  }
  console.log(`Invite sent to ${email} (role: ${role})`);
  console.log(text);
} catch (err) {
  console.error('Request error:', err.message);
  process.exit(1);
}
