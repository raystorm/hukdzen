import React, {lazy, Suspense} from 'react'
import { Route, Routes, } from "react-router";

import useAuth from "../widgets/useAuth";

import { useAppSelector } from "../../app/hooks";
import {
   DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
   USER_PATH, CURRENT_USER_PATH,
   ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
   ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH,
   LOGIN_PATH, AUTHOR_PATH, AUTHORLIST_PATH, AUTHOR_NEW_PATH,
   DONATE_PATH
} from './constants';

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

const  DonatePage     = lazy(() => import("../pages/DonationPage"));

/** Sets Up Route Maps for when to load what pages */
const AppRoutes = () => 
{
  const currentUser = useAppSelector(state => state.currentUser);

  //TODO: consider `<ErrorBoundy fallback=<ErrorPage errorCodeProp={500} />>` from `react-error-boundary`
  //      NOTE: if moving to it, only wrap Production, WILL hide dev render bugs

  return (
     <Suspense fallback={<h2>dzep gya'wn (Loading)....</h2>}>
        <Routes>
         { /* Default Route/Home Page */ }
         <Route path='/' element={<LandingPage />} errorElement={<ErrorPage />} />

           <Route path={LOGIN_PATH} element={useAuth(<LoginPage />)}     />

           { /* Document Routes */ }
           <Route path={DASHBOARD_PATH} element={useAuth(<Dashboard />)}     />
           <Route path={UPLOAD_PATH}    element={useAuth(<UploadPage />)}    />
           <Route path={SEARCH_PATH}    element={useAuth(<SearchResults />)} />

           <Route path='item'>
              <Route path=':itemId'     element={useAuth(<ItemPage />)}      />
           </Route>

           { /* Users */ }
           <Route path={USER_PATH}         element={useAuth(<UserPage path={USER_PATH} />)} />
           <Route path='/user' >
              <Route path='current' element={useAuth(<UserPage path={CURRENT_USER_PATH}/>)} />
           </Route>

           {/* Authors */}
           <Route path='/author'>
              <Route path='list'     element={useAuth(<AuthorListPage />)} />
              <Route path='new'      element={useAuth(<NewAuthorPage path={AUTHOR_NEW_PATH} />)} />
              <Route path=':authorid' element={useAuth(<AuthorPage path={AUTHOR_PATH} />)} />
           </Route>
           <Route path={AUTHORLIST_PATH}     element={useAuth(<AuthorListPage />)} />

           {/* Use amplify protected routes */}
           {/*Admin user pages */}
           { currentUser.isAdmin &&
             <Route path='admin'>
               <Route path='usersList'      element={<UserListPage />}   />
               <Route path='user' >
                 <Route path=':userId'    element={<UserPage path={ADMIN_USER_PATH} />} />
               </Route>
               <Route path='boxList'        element={<BoxListPage />}    />
               <Route path='box' >
                 <Route path=':id' >
                   <Route path='members' element={<BoxMembersPage />} />
                 </Route>
               </Route>
             </Route>
           }

           {/* Footer Pages */}
           <Route path={DONATE_PATH} element={<DonatePage />} />

           {/* Catch All Route - AKA 404 Error page */}
           <Route path='*' element={<ErrorPage />} />
         </Routes>
       </Suspense>
     )
  // */
}

export default AppRoutes;