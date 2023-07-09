import React, { useState } from 'react';

import { useAppSelector } from '../app/hooks';
import UserForm from "../components/forms/UserForm";
import {matchPath, useLocation} from "react-router-dom";

interface UserPageProps
{
  path: string;
}

const UserPage: React.FC<UserPageProps> = (props) =>
{
  const { path } = props;

  const location = useLocation();
  const skipRender = (): boolean => !matchPath(path, location.pathname);

  let currentUser = useAppSelector(state => state.currentUser);

  if ( skipRender() ) { return <></>; }

  return <UserForm user={currentUser} />
};

export default UserPage;