import { createChapteraServer } from './app.mjs'

const port = Number(process.env.PORT || 10000)
createChapteraServer().listen(port, '0.0.0.0', () => {
  console.log(`Chaptera is listening on port ${port}`)
})
