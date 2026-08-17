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
  _id: 'dashboardAccount',
  _type: 'dashboardAccount',
  customerName: 'Carol Lynn Eden',
  accountNumber: '85545454545455',
  surveillanceBanner: 'Accounts under protective surveillance of the FTC',
  totalPortfolioValue: 0,
  totalPortfolioLabel: 'Total Portfolio Value',
  totalPortfolioSub: 'Advisory Account holdings',
  interestEarnedYtd: 0,
  interestEarnedLabel: 'Interest Earned (YTD)',
  interestEarnedSub: 'No earnings this year',
  pendingOrders: 0,
  pendingOrdersLabel: 'Pending Orders',
  pendingOrdersSub: 'No pending orders',
  accounts: [
    { _key: 'acct1', name: 'Tamba bay', accountNumber: '8478749874968', accountType: 'Advisory', currency: 'USD', status: 'Active', currentBalance: 0, balance: 0, balanceLabel: 'Total Holdings', address: '123 Main St, Springfield, IL 62704', bank: 'First National Bank', routingNumber: '021000021', bankAddress: '456 Bank Ave, Chicago, IL 60601', description: 'Primary advisory account for portfolio management and securities.' },
    { _key: 'acct2', name: 'Cash Account', accountNumber: '5566778899001', accountType: 'Cash', currency: 'USD', status: 'Active', currentBalance: 0, balance: 0, balanceLabel: 'Available Balance', address: '123 Main St, Springfield, IL 62704', bank: 'Chase Bank', routingNumber: '021000015', bankAddress: '789 Commerce Blvd, New York, NY 10001', description: 'Liquid cash account for transactions and fund settlements.' },
    { _key: 'acct3', name: 'Sovereign Gold Bond', accountNumber: '3344556677889', accountType: 'Investment', currency: 'USD', status: 'Active', currentBalance: 0, balance: 0, balanceLabel: 'Total Holdings', address: '123 Main St, Springfield, IL 62704', bank: 'Bank of America', routingNumber: '026009593', bankAddress: '321 Financial Dr, Charlotte, NC 28202', description: 'Gold-denominated sovereign security for long-term value preservation.' },
    { _key: 'acct4', name: 'International US Depot', accountNumber: '9988776655443', accountType: 'International Custody', currency: 'USD', status: 'Active', currentBalance: 0, balance: 0, balanceLabel: 'Total Value (USD)', address: '123 Main St, Springfield, IL 62704', bank: 'Wells Fargo', routingNumber: '121000248', bankAddress: '555 Global St, San Francisco, CA 94105', description: 'International custody account for U.S. Treasury securities in foreign markets.' },
  ],
  events: [
    { _key: 'ev1', title: 'Quarterly Interest Payment', description: 'Your quarterly interest payment is scheduled for disbursement.', date: 'Sep 15, 2026' },
    { _key: 'ev2', title: 'Treasury Bill Auction', description: 'Next 4-week Treasury Bill auction announcement and bidding opens.', date: 'Oct 6, 2026' },
    { _key: 'ev3', title: 'I Bond Rate Announcement', description: 'New composite rate for Series I Savings Bonds to be announced.', date: 'Nov 1, 2026' },
  ],
  quickActions: [
    { _key: 'qa1', label: 'Buy Savings Bonds', href: '/savings-bonds/buy-a-bond/' },
    { _key: 'qa2', label: 'View Tax Forms (1099)', href: '/1099/' },
    { _key: 'qa3', label: 'Manage Bank Account', href: '#' },
    { _key: 'qa4', label: 'Update Profile', href: '#' },
    { _key: 'qa5', label: 'Redeem Securities', href: '#' },
  ],
  notices: [
    { _key: 'nt1', title: 'No new notices', description: 'All account notices have been reviewed.' },
    { _key: 'nt2', title: '1099 Tax Forms Available', description: 'Your 2025 tax forms are ready to view and download.' },
  ],
  eeBondRate: 2.4,
  eeBondSub: 'Fixed rate through Oct 2026',
  iBondRate: 4.26,
  iBondSub: 'Composite rate through Oct 2026',
  portfolioYield: 3.42,
  portfolioYieldSub: 'Weighted average',
  interestThisYear: 312.4,
  interestThisYearSub: 'YTD earnings',
  helpTitle: 'Need Help?',
  helpText: 'Visit the TreasuryDirect Help Center for guides, FAQs, and support resources.',
  helpButtonLabel: 'Go to Help Center',
  helpButtonHref: '/help-center/',
  auctionsTitle: 'Upcoming Auctions',
  auctionsText: 'View upcoming Treasury auctions and participate in new issuances.',
  auctionsButtonLabel: 'View Auctions',
  auctionsButtonHref: '/auctions/upcoming/',
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
  console.log('Seeded dashboardAccount document:', JSON.stringify(json));
}

async function addCors() {
  try {
    const res = await fetch(`https://api.sanity.io/${apiVersion}/projects/${projectId}/cors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ origin: 'http://localhost:3000', allowCredentials: false }),
    });
    if (res.ok) {
      console.log('CORS origin added: http://localhost:3000');
    } else {
      console.warn('Could not add CORS origin automatically (status ' + res.status + '). Add your site origins in manage.sanity.io -> API -> CORS origins.');
    }
  } catch (err) {
    console.warn('CORS origin setup skipped:', err.message);
  }
}

async function main() {
  await addCors();
  await upsert();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
