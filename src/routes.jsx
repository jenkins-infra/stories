import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import StoryPage from './pages/user-story-page/StoryPage.jsx';
import { getStoryStaticPaths, loadUserStoryRouteData } from './utils/storyload.js';

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
        getStaticPaths: getStoryStaticPaths,
        loader: loadUserStoryRouteData,
      },
    ],
  },
];

export default routes;
