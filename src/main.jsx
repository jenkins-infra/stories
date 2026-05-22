import { ViteReactSSG } from 'vite-react-ssg'
import routes from './routes'

// Create an app factory usable by the SSG CLI and the browser.
const createRoot = ViteReactSSG({
  routes
}, async (context) => {
  // You can hook into `context` here to do app-level setup during SSG.
})

export { createRoot }
export default createRoot
