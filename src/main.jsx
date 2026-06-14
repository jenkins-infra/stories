import { ViteReactSSG } from 'vite-react-ssg';
import routes from './routes';
import './theme/color-schema.css'

const createRoot = ViteReactSSG(
  {
    routes,
  },
);

export { createRoot };
export default createRoot;
