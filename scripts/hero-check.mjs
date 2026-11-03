import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots/check', { recursive: true })
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox'],
})

for (const [name, width, height] of [
  ['desktop', 1440, 1000],
  ['tablet', 1024, 900],
  ['mobile', 390, 844],
]) {
  const context = await browser.newContext({ viewport: { width, height } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(8000)
  await page.mouse.move(width - 4, height - 4)
  await page.screenshot({ path: `screenshots/check/${name}-hero.png` })

  const canvas = await page.evaluate(() => ({
    canvas: !!document.querySelector('.hero-stage canvas'),
    fallbackBook: !!document.querySelector('.hero-stage .book-stage'),
    titleWidth: document.querySelector('h1')?.getBoundingClientRect().width,
    bodyOverflow: document.documentElement.scrollWidth - window.innerWidth,
  }))
  console.log(name, JSON.stringify({ canvas, errors }))

  if (name === 'desktop') {
    await page.locator('#explore').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await page.mouse.move(4, 4)
    await page.locator('#explore').screenshot({ path: 'screenshots/check/desktop-featured.png', timeout: 120000 })
    await page.locator('#begin').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.locator('#begin').screenshot({ path: 'screenshots/check/desktop-finale.png', timeout: 120000 })
  }

  if (name === 'mobile') {
    await page.locator('#begin').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.locator('#begin').screenshot({ path: 'screenshots/check/mobile-finale.png', timeout: 120000 })
    await page.locator('#languages').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.locator('#languages').screenshot({ path: 'screenshots/check/mobile-languages.png', timeout: 120000 })
  }

  await context.close()
}
await browser.close()
