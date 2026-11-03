import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots/review', { recursive: true })
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox'],
})

async function capture(width, height, prefix) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3500)
  await page.screenshot({ path: `screenshots/review/${prefix}-hero.png` })

  for (const [selector, file] of [
    ['#how-it-works', 'how'],
    ['#languages', 'languages'],
    ['#studio', 'studio'],
    ['#player', 'player'],
    ['#explore', 'featured'],
    ['#features', 'features'],
    ['#begin', 'finale'],
    ['footer', 'footer'],
  ]) {
    const loc = page.locator(selector).first()
    await loc.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await loc.screenshot({ path: `screenshots/review/${prefix}-${file}.png`, timeout: 120000 })
  }

  if (prefix === 'desktop') {
    await page.locator('#languages').scrollIntoViewIfNeeded()
    await page.locator('.language-card').nth(1).hover()
    await page.waitForTimeout(500)
    await page.locator('#languages').screenshot({ path: 'screenshots/review/desktop-languages-hover.png', timeout: 120000 })
    await page.locator('#explore').scrollIntoViewIfNeeded()
    await page.locator('#explore .book-card').first().hover()
    await page.waitForTimeout(700)
    await page.locator('#explore').screenshot({ path: 'screenshots/review/desktop-featured-hover.png', timeout: 120000 })
  }

  await context.close()
  return errors
}

const desktopErrors = await capture(1440, 1000, 'desktop')
const tabletErrors = await capture(1024, 900, 'tablet')
const mobileErrors = await capture(390, 844, 'mobile')
console.log(JSON.stringify({ desktopErrors, tabletErrors, mobileErrors }, null, 2))
await browser.close()
