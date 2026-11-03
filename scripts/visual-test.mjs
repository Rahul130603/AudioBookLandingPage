import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5174'
mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox'],
})

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
})
const page = await context.newPage()
const messages = []
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') messages.push(`[${msg.type()}] ${msg.text()}`)
})
page.on('pageerror', (error) => messages.push(`[pageerror] ${error.message}`))

await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(7000)
console.log('PAGE READY', await page.title(), await page.evaluate(() => document.body.innerText.length))
console.log('CONSOLE', messages)
await page.screenshot({ path: 'screenshots/01-hero.png', timeout: 120000, animations: 'disabled' })

const sections = [
  ['#how-it-works', '02-how.png'],
  ['#languages', '03-languages.png'],
  ['#studio', '04-studio.png'],
  ['#player', '05-player.png'],
  ['#explore', '06-featured.png'],
  ['#features', '07-features.png'],
  ['#begin', '08-finale.png'],
  ['footer', '09-footer.png'],
]

for (const [selector, file] of sections) {
  const loc = page.locator(selector).first()
  await loc.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `screenshots/${file}` })
}

// Full page at a narrow desktop width to catch layout drift
await page.setViewportSize({ width: 1024, height: 900 })
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
await page.screenshot({ path: 'screenshots/10-1024-top.png' })

const layout = await page.evaluate(() => ({
  viewport: { w: innerWidth, h: innerHeight },
  bodyScrollWidth: document.documentElement.scrollWidth,
  bodyClientWidth: document.documentElement.clientWidth,
  sections: [...document.querySelectorAll('section')].map((section) => ({
    id: section.id,
    height: Math.round(section.getBoundingClientRect().height),
  })),
}))

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  colorScheme: 'dark',
})
const mobilePage = await mobile.newPage()
const mobileErrors = []
mobilePage.on('pageerror', (error) => mobileErrors.push(`[pageerror] ${error.message}`))
await mobilePage.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
await mobilePage.waitForTimeout(4500)
await mobilePage.screenshot({ path: 'screenshots/11-mobile-hero.png' })
await mobilePage.locator('#languages').scrollIntoViewIfNeeded()
await mobilePage.waitForTimeout(1000)
await mobilePage.screenshot({ path: 'screenshots/12-mobile-languages.png' })
await mobilePage.locator('#player').scrollIntoViewIfNeeded()
await mobilePage.waitForTimeout(1000)
await mobilePage.screenshot({ path: 'screenshots/13-mobile-player.png' })
await mobilePage.locator('#studio').scrollIntoViewIfNeeded()
await mobilePage.waitForTimeout(1000)
await mobilePage.screenshot({ path: 'screenshots/14-mobile-studio.png' })

const mobileLayout = await mobilePage.evaluate(() => ({
  bodyScrollWidth: document.documentElement.scrollWidth,
  bodyClientWidth: document.documentElement.clientWidth,
}))

console.log(JSON.stringify({ messages, layout, mobileErrors, mobileLayout }, null, 2))
await browser.close()
