import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import StoryPage from './pages/user-story-page/StoryPage.jsx';
import {
  getStoryStaticPaths,
  loadAllStoriesRouteData,
  loadUserStoryRouteData,
} from './utils/storyload.js';
import NotFound from './pages/not-found-page/NotFoundPage.jsx';
import MapPage from './pages/map-page/MapPage.jsx';
import All from './pages/all-stories-page/All.jsx';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
        loader: async () => ({
          stories: await loadAllStoriesRouteData(),
        }),
      },
      {
        path: '/user-story/:slug',
        element: <StoryPage />,
        errorElement: <NotFound />,
        getStaticPaths: getStoryStaticPaths,
        loader: loadUserStoryRouteData,
      },
      {
        path: '/map',
        element: <MapPage />,
      },
      {
        path: '/all',
        element: <All />,
        loader: loadAllStoriesRouteData,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
