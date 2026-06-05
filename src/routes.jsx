import {
  getStoryStaticPaths,
  loadUserStoryRouteData,
  getStorySlugs,
  loadStoryData,
  allStoriesLoader,
} from './utils/storyload.js';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import UserStory from './pages/user-story-page/UserStory.jsx';
import NotFound from './pages/not-found-page/NotFoundPage.jsx';
import All from './pages/stories-page/All.jsx';
import Map from './pages/map-page/Map.jsx';

const routes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/all',
    element: <All />,
    loader: allStoriesLoader,
  },
  {
    path: '/map',
    element: <Map />,
  },
  {
    path: '/user-story/:slug',
    element: <UserStory />,
    getStaticPaths: getStoryStaticPaths,
    loader: loadUserStoryRouteData,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;