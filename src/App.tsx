import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import ServicePage from './pages/ServicePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * App router (services spec §3; work page §3; web-design spec §3; contact spec
 * §7; about spec §7; terms spec §8). `/`, `/services`, `/work`, `/about`,
 * `/contact`, `/terms-conditions`, `/web-design`, `/seo-manchester` and
 * `/branding` exist; every other path falls through to `NotFoundPage`.
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'terms-conditions', element: <TermsPage /> },
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
