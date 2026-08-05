import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/landing-page/LandingPage.jsx';
import StoryPage from './pages/user-story-page/StoryPage.jsx';
import CaseStudiesPage from './pages/case-studies-page/CaseStudiesPage.jsx';
import CaseStudyPage from './pages/case-study-page/CaseStudyPage.jsx';
import {
  getStoryStaticPaths,
  loadAllStoriesRouteData,
  loadUserStoryRouteData,
} from './utils/storyload.js';
import {
  getCaseStudyStaticPaths,
  loadAllCaseStudiesRouteData,
  loadCaseStudyRouteData,
} from './utils/caseload.js';
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
        path: '/case-studies',
        element: <CaseStudiesPage />,
        loader: loadAllCaseStudiesRouteData,
      },
      {
        path: '/case-studies/:slug',
        element: <CaseStudyPage />,
        errorElement: <NotFound />,
        getStaticPaths: getCaseStudyStaticPaths,
        loader: loadCaseStudyRouteData,
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
