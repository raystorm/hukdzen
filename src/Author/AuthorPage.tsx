import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";

import { useAppSelector } from '../app/hooks';
import AuthorForm from '../components/forms/AuthorForm';
import {useParams} from "react-router-dom";
import {authorActions} from "./authorSlice";
import {emptyAuthor} from "./AuthorType";

interface AuthorPageProps
{

}

const AuthorPage: React.FC<AuthorPageProps> = (props) =>
{
  const dispatch = useDispatch();
  const { authorId } = useParams(); //Author
  console.log(`AuthorId: ${authorId}`);

  useEffect(() => {
              if (authorId) { dispatch(authorActions.getAuthorById(authorId)); }
            },
            []);

  let author = useAppSelector(state => state.author);

  return <AuthorForm author={author} />
};

export default AuthorPage;