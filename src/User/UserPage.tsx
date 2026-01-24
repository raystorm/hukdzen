import React from 'react';

import { useAppSelector } from '../app/hooks';
import { useSkipRender } from "../components/hooks/useSkipRender";

import UserForm from "./UserForm";

interface UserPageProps
{
  path: string;
}

const UserPage: React.FC<UserPageProps> = (props) =>
{
  const { path } = props;

  const skipRender = useSkipRender(path);

  let currentUser = useAppSelector(state => state.currentUser);

  if ( skipRender() ) { return <></>; }

  return <UserForm user={currentUser} showEmailPreferences={true} />
};

export default UserPage;