import { Login } from '@/pages';
import ErrorPage from '@/pages/error-page';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '',
        element: <div>Logado</div>,
        errorElement: <ErrorPage />,
      }
    ],
  },
]);
