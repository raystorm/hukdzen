import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '../app/reducers';
import { Gyet } from './userType';
import UserForm from '../components/forms/UserForm';


interface UserPageProps 
{

}

const UserPage: React.FC<UserPageProps> = (props) =>
{
  let currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);

  return <UserForm user={currentUser} />
};

export default UserPage;