import React, {useEffect, useState} from 'react';
import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from '../app/hooks';
import AuthorForm from '../components/forms/AuthorForm';
import {useLocation, useParams} from "react-router-dom";
import {authorActions} from "./authorSlice";
import {emptyAuthor} from "./AuthorType";

interface NewAuthorPageProps
{
  path: string;
}

const NewAuthorPage: React.FC<NewAuthorPageProps> = (props) =>
{
  const { path } = props;

  const location = useLocation();
  const skipRender = (): boolean => path !== location.pathname;

  const author = {
    ...emptyAuthor,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if ( skipRender() ) {return <></>; }

  return <AuthorForm author={author} isNew />
};

export default NewAuthorPage;