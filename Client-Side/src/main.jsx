import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async';

import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Home from './components/Home/Home';

import AdventuresDetail from './components/AdventureDetail/AdventureDetail';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AuthProvider from './providers/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import MyFavorites from './components/MyFavorites/MyFavorites';
import AddMovies from './components/AddMovies/AddMovies';
import AllMovies from './components/AllMovies/AllMovies';
import MovieDetails from './components/MovieDetails/MovieDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
        loader: () => fetch('http://localhost:5000/all-movies'),
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'register',
        element: <Register></Register>
      },
      {
        path: 'adventures/:id',
        element: <PrivateRoute><AdventuresDetail></AdventuresDetail></PrivateRoute>,
        loader: () => fetch('/adventures.json')
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      },
      {
        path: 'update-profile',
        element: <PrivateRoute><UpdateProfile></UpdateProfile></PrivateRoute>
      },
      {
        path: 'add-movies',
        element: <PrivateRoute><AddMovies></AddMovies></PrivateRoute>
      },
      {
        path: 'my-favorites',
        element: <PrivateRoute><MyFavorites></MyFavorites></PrivateRoute>
      },
      {
        path: 'all-movies',
        element: <PrivateRoute><AllMovies></AllMovies></PrivateRoute>,
        loader: () => fetch('http://localhost:5000/all-movies')
      },
      {
        path: 'movie/:id',
        element: <PrivateRoute><MovieDetails></MovieDetails></PrivateRoute>,
        loader: ({ params }) => fetch(`http://localhost:5000/movie/${params.id}`)
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </HelmetProvider>
  </StrictMode>
)
