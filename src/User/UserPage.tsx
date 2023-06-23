import React, { useState } from 'react';

import { useAppSelector } from '../app/hooks';
import UserForm from "../components/forms/UserForm";
import {useLocation} from "react-router-dom";
import {DASHBOARD_PATH} from "../components/shared/constants";

interface UserPageProps
{
  path: string;
}

const UserPage: React.FC<UserPageProps> = (props) =>
{
  const { path } = props;

  const location = useLocation();
  const skipRender = (): boolean => path !== location.pathname;

  let currentUser = useAppSelector(state => state.currentUser);

  if ( skipRender() ) { return <></>; }

  return <UserForm user={currentUser} />
};

export default UserPage;