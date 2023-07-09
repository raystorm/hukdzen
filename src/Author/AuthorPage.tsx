import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";

import { useAppSelector } from '../app/hooks';
import AuthorForm from '../components/forms/AuthorForm';
import {matchPath, useLocation, useParams} from "react-router-dom";
import {authorActions} from "./authorSlice";
import {emptyAuthor} from "./AuthorType";

interface AuthorPageProps
{
   path: string
}

const AuthorPage: React.FC<AuthorPageProps> = (props) =>
{
   const { path } = props;

   const location = useLocation();
   const skipRender = (): boolean => !matchPath(path, location.pathname);

  const dispatch = useDispatch();
  const { authorId } = useParams(); //Author
  console.log(`AuthorId: ${authorId}`);

  useEffect(() => {
              if ( skipRender() ) { return; }
              if (authorId) { dispatch(authorActions.getAuthorById(authorId)); }
            },
            []);

  let author = useAppSelector(state => state.author);

  if ( skipRender() ) { return <></>; }

  return <AuthorForm author={author} />
};

export default AuthorPage;