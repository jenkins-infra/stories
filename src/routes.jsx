import {
  getStoryStaticPaths,
  loadUserStoryRouteData,
} from './utils/storyload.js';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import UserStory from './pages/user-story-page/UserStory.jsx';
import NotFound from './pages/not-found-page/NotFoundPage.jsx';

const routes = [
  {
    path: '/',
    element: <LandingPage />,
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
