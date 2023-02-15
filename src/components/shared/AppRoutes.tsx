import React from 'react'
import { useSelector } from 'react-redux';
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
import { ReduxState } from '../../app/reducers';
import { Gyet } from '../../User/userType';
import { 
  DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
  USER_PATH, CURRENT_USER_PATH,
  ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
  ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH
 } from './constants';


/**
 * Poor Man's Authentication scheme to secure admin pages
 * @param currentUser current user to check for admin rights
 * @param page page to be loaded if permisions
 * @returns page if permissions, or error page
 */
const adminPage = (currentUser: Gyet, page: JSX.Element ) => {
  return currentUser.isAdmin ? page : <ErrorPage />;
}

/** Sets Up Route Maps for when to load what pages */
const AppRoutes = () => 
{
  const currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);
  
  return (
     <Routes>
      { /* Default Route/Home Page */ }
      <Route path='/' element={<LandingPage />} errorElement={<ErrorPage />} />
  
      { /* Document Routes */ }
      <Route path={DASHBOARD_PATH} element={<Dashboard />} />
      <Route path={ITEM_PATH}      element={<ItemPage /> } />
      <Route path={UPLOAD_PATH}    element={<UploadPage />} />
      <Route path={SEARCH_PATH}    element={<SearchResults />} />

      { /* users */ }
      <Route path={USER_PATH}         element={<UserPage />} />
      <Route path={CURRENT_USER_PATH} element={<UserPage />} />
      
       {/* Use amplify protected routes */}
       {/*Admin user pages */}
       { currentUser.isAdmin && 
         <>
           <Route path={ADMIN_USERLIST_PATH}   element={<UserListPage />}   />
           <Route path={ADMIN_USER_PATH}       element={<UserPage />}       />
           <Route path={ADMIN_BOXLIST_PATH}    element={<BoxListPage />}    />
           <Route path={ADMIN_BOXMEMBERS_PATH} element={<BoxMembersPage />} />
         </>
       }
     </Routes>
     )
  // */
}

export default AppRoutes;