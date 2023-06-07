import React, {useEffect, useState} from 'react';
import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from '../app/hooks';
import AuthorForm from '../components/forms/AuthorForm';
import {useParams} from "react-router-dom";
import {authorActions} from "./authorSlice";
import {emptyAuthor} from "./AuthorType";

interface NewAuthorPageProps
{

}

const NewAuthorPage: React.FC<NewAuthorPageProps> = (props) =>
{
  const author = {
    ...emptyAuthor,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  return <AuthorForm author={author} isNew />
};

export default NewAuthorPage;