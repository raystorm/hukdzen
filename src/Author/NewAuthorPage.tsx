import React from 'react';
import { v4 as randomUUID } from 'uuid';

import AuthorForm from '../components/forms/AuthorForm';
import {matchPath, useLocation} from "react-router-dom";
import {emptyAuthor} from "./AuthorType";

interface NewAuthorPageProps
{
  path: string;
}

const NewAuthorPage: React.FC<NewAuthorPageProps> = (props) =>
{
  const { path } = props;

  const location = useLocation();
  const skipRender = (): boolean => !matchPath(path, location.pathname);

  const author = {
    ...emptyAuthor,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if ( skipRender() ) {return <></>; }

  return <AuthorForm author={author} isNew />
};

export default NewAuthorPage;