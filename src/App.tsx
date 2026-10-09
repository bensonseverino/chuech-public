import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * App router (services spec §3; work page §3). `/`, `/services` and `/work`
 * exist for now; every other path falls through to `NotFoundPage` (no
 * placeholder pages, so `/work/<slug>` and the service links do too).
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'work', element: <WorkPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
