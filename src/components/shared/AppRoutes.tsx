import React from 'react'
import { PathRouteProps, Route, Routes } from "react-router-dom";

import ErrorPage      from '../pages/ErrorPage';
import LandingPage    from '../pages/LandingPage';
import Dashboard      from '../pages/Dashboard';
import ItemPage       from '../pages/ItemPage';
import UploadPage     from '../pages/UploadPage';
import SearchResults  from '../pages/SearchResults';
import UserListPage   from '../../User/UserList/UserListPage';
import UserPage       from '../../User/UserPage';
import BoxListPage    from '../../Box/BoxList/BoxListPage';
import BoxMembersPage from '../../Box/BoxMembersPage';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../app/reducers';
import { Gyet } from '../../User/userType';

/**
 *  Map of Paths to pages for available routes
 *  TODO: combine with AppBar maps
 */
export const routes: PathRouteProps[] = [
  //Default Route/Home Page
  { path: '/', element: <LandingPage />, errorElement: <ErrorPage /> },
  
  //Document Routes
  { path: '/dashboard',    element: <Dashboard /> },
  { path: '/item/:itemId', element: <ItemPage /> },
  { path: '/mangyen',      element: <UploadPage /> },
  { path: '/search',       element: <SearchResults /> },

  //users
  { path: '/waa',          element: <UserPage /> },
  { path: '/user/current', element: <UserPage /> },

  /* TODO: add authentication for the admin routes
  { path: '/admin/usersList',       element: <UserListPage />,   },
  { path: '/admin/user/:userId',    element: <UserPage />,       },
  { path: '/admin/boxList',         element: <BoxListPage />,    },
  { path: '/admin/box/:id/members', element: <BoxMembersPage />, },
  // */
];

/** Sets Up Route Maps for when to load what pages */
const AppRoutes = () => 
{
  const currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);
  
  return (
     <Routes>
       {routes.map((route) => (<Route key={route.path} {...route} />))}
       {/* Use amplify protected routes */}
       {/* TODO: add a currentUser.isAdmin check */}
       {/*Admin user pages */}
       { currentUser.isAdmin && 
         <>
           <Route path='/admin/usersList'       element={<UserListPage />}   />
           <Route path='/admin/user/:userId'    element={<UserPage />}       />
           <Route path='/admin/boxList'         element={<BoxListPage />}    />
           <Route path='/admin/box/:id/members' element={<BoxMembersPage />} />
         </>
       }

     </Routes>
  )
}

export default AppRoutes;