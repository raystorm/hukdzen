import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap } from '@mui/material';
import ReduxStore from '../app/store';
import { ReduxState } from '../app/reducers';
import { Clan, ClanType, Gyet } from './userType';
import { userActions } from './userSlice';
import { handleBreakpoints } from '@mui/system';
import { SwitchLeft } from '@mui/icons-material';
import UserForm from '../components/forms/UserForm';


interface UserPageProps 
{

}

const clans = [
    { value: Clan.Raven.name,        label: Clan.Raven.toString(), },
    { value: Clan.Eagle.name,        label: Clan.Eagle.toString(), },
    { value: Clan.Killerwhale.name,  label: Clan.Killerwhale.toString(), },
    { value: Clan.Wolf.name,         label: Clan.Wolf.toString(), },
];

const UserPage: React.FC<UserPageProps> = (props) =>
{
  //TODO: load current User
  let currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);

  return <UserForm user={currentUser} />
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)