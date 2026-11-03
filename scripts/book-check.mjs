import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('pageerror', (error) => console.log('PAGEERROR', error.message))
await page.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
for (const [delay, file] of [
  [4000, 'book-04s.png'],
  [6000, 'book-10s.png'],
  [6000, 'book-16s.png'],
]) {
  await page.waitForTimeout(delay)
  await page.mouse.move(4, 996)
  await page.screenshot({ path: `screenshots/check/${file}` })
  console.log('captured', file)
}
await browser.close()
