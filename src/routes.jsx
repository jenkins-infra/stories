import Home from './Home.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFoundPage />
  },
]

export default routes
