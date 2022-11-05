import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap } from '@mui/material';
import ReduxStore from '../app/store';
import { ReduxState } from '../app/reducers';
import { Role, RoleType, Xbiis } from './boxTypes';
import UserForm from '../components/forms/UserForm';


interface BoxPageProps 
{

}

const clans = [
    { value: Role.Raven.name,        label: Role.Raven.toString(), },
    { value: Role.Eagle.name,        label: Role.Eagle.toString(), },
    { value: Role.Killerwhale.name,  label: Role.Killerwhale.toString(), },
    { value: Role.Wolf.name,         label: Role.Wolf.toString(), },
];

const BoxPage: React.FC<BoxPageProps> = (props) =>
{
  //TODO: load current User
  let currentUser = useSelector<ReduxState, Xbiis>(state => state.currentUser);

  return <UserForm user={currentUser} />
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxPage)