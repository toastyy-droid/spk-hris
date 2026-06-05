const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const apiUrl = process.env.API_URL || 'http://localhost:4000/api';
const outDir = path.join(process.cwd(), 'docs', 'images');

const pages = [
  { url: '/', file: 'dashboard-supplier.png', text: 'Dashboard Supplier' },
  { url: '/suppliers', file: 'data-supplier.png', text: 'Data Supplier' },
  { url: '/spk', file: 'evaluasi-supplier.png', text: 'Evaluasi Supplier' },
  { url: '/criteria', file: 'kriteria-penilaian.png', text: 'Kriteria Penilaian' },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const loginResponse = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const loginJson = await loginResponse.json();
  const token = loginJson?.data?.accessToken;
  if (!token) throw new Error('Gagal mengambil token login untuk screenshot.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await page.setCookie({ name: 'token', value: token, url: baseUrl, path: '/', maxAge: 86400 });
  await page.evaluateOnNewDocument((authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('tokenExpiresAt', String(Date.now() + 24 * 60 * 60 * 1000));
  }, token);

  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate((authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('tokenExpiresAt', String(Date.now() + 24 * 60 * 60 * 1000));
  }, token);

  for (const target of pages) {
    await page.goto(`${baseUrl}${target.url}`, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForFunction(
      (expectedText) => {
        const bodyText = document.body?.innerText || '';
        return bodyText.includes(expectedText) && !bodyText.includes('Menyiapkan sesi login');
      },
      { timeout: 60000 },
      target.text,
    );
    await wait(1000);
    await page.screenshot({ path: path.join(outDir, target.file), fullPage: true });
    console.log(`Captured ${target.file}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
