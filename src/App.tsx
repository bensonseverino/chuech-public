import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import ServicePage from './pages/ServicePage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * App router (services spec §3; work page §3; web-design spec §3). `/`,
 * `/services`, `/work`, `/web-design`, `/seo-manchester` and `/branding` exist
 * for now; every other path — including the services that have no page yet —
 * falls through to `NotFoundPage` (no placeholder pages).
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'web-design', element: <ServicePage slug="web-design" /> },
      { path: 'seo-manchester', element: <ServicePage slug="seo-manchester" /> },
      { path: 'branding', element: <ServicePage slug="branding" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
