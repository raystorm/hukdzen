import React, { useCallback, useEffect } from 'react';
import { useDispatch } from "react-redux";

import { useAppSelector } from '../app/hooks';
import AuthorForm from '../components/forms/AuthorForm';
import {matchPath, useLocation, useParams} from "react-router";
import {authorActions} from "./authorSlice";

interface AuthorPageProps
{
   path: string
}

const AuthorPage: React.FC<AuthorPageProps> = (props) =>
{
   const { path } = props;

   const location = useLocation();
   const skipRender = useCallback(
      (): boolean => !matchPath(path, location.pathname), [path, location]
   );

  const dispatch = useDispatch();
  const { authorId } = useParams(); //Author
  console.log(`AuthorId: ${authorId}`);

  useEffect(() => {
              if ( skipRender() ) { return; }
              if (authorId) { dispatch(authorActions.getAuthorById(authorId)); }
            },
            [authorId, skipRender, dispatch]);

  let author = useAppSelector(state => state.author);

  if ( skipRender() ) { return <></>; }

  return <AuthorForm author={author} />
};

export default AuthorPage;