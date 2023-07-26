import React, {lazy, Suspense} from 'react'
import { Route, Routes, } from "react-router-dom";

import useAuth from "../widgets/useAuth";

import { useAppSelector } from "../../app/hooks";
import {
   DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
   USER_PATH, CURRENT_USER_PATH,
   ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
   ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH,
   LOGIN_PATH, AUTHOR_PATH, AUTHORLIST_PATH, AUTHOR_NEW_PATH
} from './constants';

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

// Lazy Page Imports

const  ErrorPage      = lazy(() => import('../pages/ErrorPage'));
const  LandingPage    = lazy(() => import('../pages/LandingPage'));
const  Dashboard      = lazy(() => import('../pages/Dashboard'));
const  ItemPage       = lazy(() => import('../pages/ItemPage'));
const  UploadPage     = lazy(() => import('../pages/UploadPage'));
const  SearchResults  = lazy(() => import('../pages/SearchResults'));
const  LoginPage      = lazy(() => import("../pages/LoginPage"));

const  UserListPage   = lazy(() => import('../../User/UserList/UserListPage'));
const  UserPage       = lazy(() => import('../../User/UserPage'));

const  BoxListPage    = lazy(() => import('../../Box/BoxList/BoxListPage'));
const  BoxMembersPage = lazy(() => import('../../Box/BoxMembersPage'));

const  AuthorListPage = lazy(() => import("../../Author/AuthorList/AuthorListPage"));
const  AuthorPage     = lazy(() => import("../../Author/AuthorPage"));
const  NewAuthorPage  = lazy(() => import("../../Author/NewAuthorPage"));

/** Sets Up Route Maps for when to load what pages */
const AppRoutes = () => 
{
  const currentUser = useAppSelector(state => state.currentUser);

  /*
   * TODO: Build a better loading page
   */

  return (
     <Suspense fallback={<h2>dzep gya'wn (Loading)....</h2>}>
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
         <Route path={USER_PATH}         element={<UserPage path={USER_PATH} />} />
         <Route path={CURRENT_USER_PATH} element={<UserPage path={CURRENT_USER_PATH}/>} />

         {/* Authors */}
         <Route path={AUTHORLIST_PATH} element={<AuthorListPage />} />
         <Route path={AUTHOR_NEW_PATH} element={<NewAuthorPage path={AUTHOR_NEW_PATH} />} />
         <Route path={AUTHOR_PATH}     element={<AuthorPage path={AUTHOR_PATH} />} />

          {/* Use amplify protected routes */}
          {/*Admin user pages */}
          { currentUser.isAdmin &&
            <>
              <Route path={ADMIN_USERLIST_PATH}   element={<UserListPage />}   />
              <Route path={ADMIN_USER_PATH}       element={<UserPage path={ADMIN_USER_PATH} />} />
              <Route path={ADMIN_BOXLIST_PATH}    element={<BoxListPage />}    />
              <Route path={ADMIN_BOXMEMBERS_PATH} element={<BoxMembersPage />} />
            </>
          }
        </Routes>
     </Suspense>
     )
  // */
}

export default AppRoutes;