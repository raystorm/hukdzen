import React, { useState } from 'react';

import { useAppSelector } from '../app/hooks';
import UserForm from "../components/forms/UserForm";

interface UserPageProps
{

}

const UserPage: React.FC<UserPageProps> = (props) =>
{
  let currentUser = useAppSelector(state => state.currentUser);

  return <UserForm user={currentUser} />
};

export default UserPage;