import { ViteReactSSG } from 'vite-react-ssg';
import routes from './routes';

const createRoot = ViteReactSSG(
  {
    routes,
  },
);

export { createRoot };
export default createRoot;
