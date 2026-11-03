import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-gpu-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('pageerror', (error) => console.log('PAGEERROR', error.message))
await page.goto('http://127.0.0.1:5174', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(5000)
await page.mouse.move(10, 10)
await page.locator('#explore').scrollIntoViewIfNeeded()
await page.waitForTimeout(2200)
await page.mouse.move(10, 10)
await page.screenshot({ path: 'screenshots/featured-debug.png' })

const data = await page.evaluate(() => {
  const stage = document.querySelector('#explore .book-stage')
  const book = document.querySelector('#explore .book-3d')
  const cover = document.querySelector('#explore .book-3d__cover')
  const card = document.querySelector('#explore .book-card')
  const reveal = card?.parentElement
  const styles = (el) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return {
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      transform: cs.transform,
      transformStyle: cs.transformStyle,
      background: cs.backgroundColor,
      overflow: cs.overflow,
      zIndex: cs.zIndex,
      position: cs.position,
      perspective: cs.perspective,
      backface: cs.backfaceVisibility,
      contentVisibility: cs.contentVisibility,
    }
  }
  return {
    stage: styles(stage),
    book: styles(book),
    cover: styles(cover),
    card: styles(card),
    reveal: styles(reveal),
    coverHTML: cover ? cover.innerHTML.slice(0, 300) : null,
    coverChildRect: cover?.firstElementChild?.getBoundingClientRect().toJSON(),
    bookChildren: book ? [...book.children].map((el) => ({ cls: el.className, ...styles(el) })) : [],
    sectionScroll: document.querySelector('#explore').getBoundingClientRect().top,
    windowScrollY: window.scrollY,
  }
})
console.log(JSON.stringify(data, null, 2))

const firstCard = page.locator('#explore .book-card').first()
await firstCard.screenshot({ path: 'screenshots/featured-card-debug.png', timeout: 60000 })
await browser.close()
