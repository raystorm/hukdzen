import React from 'react'
import { Route, Routes, } from "react-router-dom";

import useAuth from "../widgets/useAuth";

import { useAppSelector } from "../../app/hooks";

import ErrorPage      from '../pages/ErrorPage';
import LandingPage    from '../pages/LandingPage';
import Dashboard      from '../pages/Dashboard';
import ItemPage       from '../pages/ItemPage';
import UploadPage     from '../pages/UploadPage';
import SearchResults  from '../pages/SearchResults';
import LoginPage      from "../pages/LoginPage";
import UserListPage   from '../../User/UserList/UserListPage';
import UserPage       from '../../User/UserPage';
import BoxListPage    from '../../Box/BoxList/BoxListPage';
import BoxMembersPage from '../../Box/BoxMembersPage';

import {
   DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
   USER_PATH, CURRENT_USER_PATH,
   ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
   ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH,
   LOGIN_PATH, LOGOUT_PATH, AUTHOR_PATH, AUTHORLIST_PATH, AUTHOR_NEW_PATH
} from './constants';
import AuthorListPage from "../../Author/AuthorList/AuthorListPage";
import AuthorPage from "../../Author/AuthorPage";
import NewAuthorPage from "../../Author/NewAuthorPage";


/**
 * Poor Man's Authentication scheme to secure admin pages
 * @param currentUser current user to check for admin rights
 * @param page page to be loaded if permisions
 * @returns page if permissions, or error page
 * /
const adminPage = (currentUser: Gyet, page: JSX.Element ) => {
  return currentUser.isAdmin ? page : <ErrorPage />;
}
// * /
const wrapAuthenticator = (component: JSX.Element ) => {
   return <Authenticator>{component}</Authenticator>;
}
*/

/** Sets Up Route Maps for when to load what pages */
const AppRoutes = () => 
{
  const currentUser = useAppSelector(state => state.currentUser);

  /*
   * TODO: check Auth and then build the routes list
   */

  return (
     <Routes>
      { /* Default Route/Home Page */ }
      <Route path='/' element={<LandingPage />} errorElement={<ErrorPage />} />

      <Route path={LOGIN_PATH} element={useAuth(<LoginPage />)}     />

      { /* Document Routes */ }
      <Route path={DASHBOARD_PATH} element={useAuth(<Dashboard />)}     />
      <Route path={ITEM_PATH}      element={useAuth(<ItemPage />)}      />
      <Route path={UPLOAD_PATH}    element={useAuth(<UploadPage />)}    />
      <Route path={SEARCH_PATH}    element={useAuth(<SearchResults />)} />

      { /* Users */ }
      <Route path={USER_PATH}         element={<UserPage />} />
      <Route path={CURRENT_USER_PATH} element={<UserPage />} />

      {/* Authors */}
      <Route path={AUTHORLIST_PATH} element={<AuthorListPage />} />
      <Route path={AUTHOR_NEW_PATH} element={<NewAuthorPage />} />
      <Route path={AUTHOR_PATH}     element={<AuthorPage />} />

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