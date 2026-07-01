import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import StoryPage from './pages/user-story-page/StoryPage.jsx';
import {
  getStoryStaticPaths,
  loadUserStoryRouteData,
} from './utils/storyload.js';
import NotFound from './pages/not-found-page/NotFoundPage.jsx';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/user-story/:slug',
        element: <StoryPage />,
        errorElement: <NotFound />,
        getStaticPaths: getStoryStaticPaths,
        loader: loadUserStoryRouteData,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
