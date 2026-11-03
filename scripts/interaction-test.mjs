import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots', { recursive: true })
mkdirSync('.tmp', { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox', '--autoplay-policy=no-user-gesture-required'],
})

const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const messages = []
page.on('console', (msg) => {
  if (msg.type() === 'error') messages.push(`[console] ${msg.text()}`)
})
page.on('pageerror', (error) => messages.push(`[pageerror] ${error.message}`))

await page.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(4500)
await page.mouse.move(5, 5)

// Full-section captures to inspect complete layouts
for (const [selector, file] of [
  ['#how-it-works', 'section-how.png'],
  ['#languages', 'section-languages.png'],
  ['#studio', 'section-studio.png'],
  ['#player', 'section-player.png'],
  ['#explore', 'section-featured.png'],
  ['#features', 'section-features.png'],
  ['#begin', 'section-finale.png'],
]) {
  const section = page.locator(selector)
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  await page.mouse.move(5, 5)
  await section.screenshot({ path: `screenshots/${file}`, timeout: 120000 })
}

// Player tests
await page.locator('#player').scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
const playButton = page.locator('#player button[aria-label="Play audiobook"]').first()
await playButton.click()
await page.waitForTimeout(1800)
const audioState = await page.evaluate(() => {
  const audio = document.querySelector('#player audio')
  return {
    exists: !!audio,
    paused: audio?.paused,
    currentTime: audio?.currentTime,
    duration: audio?.duration,
    readyState: audio?.readyState,
    volume: audio?.volume,
    playbackRate: audio?.playbackRate,
  }
})
await page.screenshot({ path: 'screenshots/player-playing.png' })

// Chapter switch
await page.locator('#player .chapter-row').nth(1).click()
await page.waitForTimeout(1100)
const chapterState = await page.evaluate(() => {
  const audio = document.querySelector('#player audio')
  return { paused: audio?.paused, currentTime: audio?.currentTime, src: audio?.getAttribute('src') }
})

// Skip, rate, volume, bookmark
await page.locator('#player button[aria-label="Forward 15 seconds"]').click()
await page.locator('#player button[aria-label="Playback speed 1.5x"]').click()
await page.locator('#player input[aria-label="Volume"]').fill('0.35')
await page.locator('#player button[aria-label="Bookmark current position"]').click()
const mediaState = await page.evaluate(() => {
  const audio = document.querySelector('#player audio')
  return {
    currentTime: audio?.currentTime,
    playbackRate: audio?.playbackRate,
    volume: audio?.volume,
    bookmark: localStorage.getItem('chaptera:bookmark:v1'),
  }
})

// Studio conversion flow
await page.locator('#studio').scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
await page.locator('#manuscript-upload').setInputFiles({
  name: 'test-manuscript.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from(
    'The lighthouse keeper had counted every ship for forty years. On the morning the sea went quiet, a small boat arrived with no sail and no name. Inside lay a book that had not yet been written. This is where the story begins.',
  ),
})
await page.waitForTimeout(600)
await page.getByRole('button', { name: /Convert to audio/i }).click()
await page.waitForTimeout(6500)
const studioState = await page.evaluate(() => ({
  complete: document.body.innerText.includes('Preview ready'),
  demoDownload: document.querySelector('#studio a[download]')?.getAttribute('download'),
  progressText: [...document.querySelectorAll('#studio span')].map((el) => el.textContent).find((text) => text?.includes('100%')),
}))
await page.locator('#studio').screenshot({ path: 'screenshots/studio-complete.png', timeout: 120000 })

// Invalid file format test
await page.locator('#studio button[aria-label="Remove manuscript"]').click()
await page.waitForTimeout(400)
await page.locator('#manuscript-upload').setInputFiles({
  name: 'bad-format.exe',
  mimeType: 'application/octet-stream',
  buffer: Buffer.from('not a book'),
})
await page.waitForTimeout(500)
const invalidState = await page.evaluate(() => document.body.innerText.includes('is not a supported format'))

// Mobile nav and footer modal
await page.setViewportSize({ width: 390, height: 844 })
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(500)
await page.getByRole('button', { name: 'Open navigation menu' }).click()
await page.waitForTimeout(500)
const navOpen = await page.locator('nav[aria-label="Mobile"]').isVisible()
await page.getByRole('button', { name: 'Close navigation menu' }).click()
await page.waitForTimeout(400)
await page.locator('footer').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'Privacy Policy' }).click()
await page.waitForTimeout(500)
const privacyOpen = await page.getByRole('dialog').isVisible()
await page.getByRole('button', { name: 'Close dialog' }).click()

// Reduced motion context
const reduced = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
})
const reducedPage = await reduced.newPage()
const reducedErrors = []
reducedPage.on('pageerror', (error) => reducedErrors.push(error.message))
await reducedPage.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
await reducedPage.waitForTimeout(3500)
const reducedState = await reducedPage.evaluate(() => ({
  title: document.title,
  hasHero: !!document.querySelector('#home'),
  bodyWidth: document.documentElement.scrollWidth,
  viewport: window.innerWidth,
}))
await reducedPage.screenshot({ path: 'screenshots/reduced-hero.png' })

console.log(
  JSON.stringify(
    {
      messages,
      audioState,
      chapterState,
      mediaState,
      studioState,
      invalidState,
      navOpen,
      privacyOpen,
      reducedErrors,
      reducedState,
    },
    null,
    2,
  ),
)

await browser.close()
