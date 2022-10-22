import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { ReduxState } from '../app/reducers';
import { TextField, MenuItem } from '@mui/material';
import { clan } from './userType';

type Props = {}

const clans = [
    {
        value: clan.Raven.name,
        label: clan.Raven.toString(),
    },
    {
        value: clan.Eagle.name,
        label: clan.Eagle.toString(),
    },
    {
        value: clan.Killerwhale.name,
        label: clan.Killerwhale.toString(),
    },
    {
        value: clan.Wolf.name,
        label: clan.Wolf.toString(),
    },
];

export class UserPage extends Component<Props> 
{
    //TODO: load current User
  state = {}

  render() {
    return (
      //TODO: user form
      <form>
        <h2>User Information</h2>
        <TextField name='id' type='hidden' style={{display: 'none'}} /><br />
        <TextField name='name'  label='Name' /><br />
        <TextField name='email' label='E-Mail' /><br />
        <TextField name='waa'   label='Waa' /><br />
        <TextField name='clan'  label='Clan' select
                   style={{minWidth: '14.5em'}}>
                   { clans.map((c) => (
                       <MenuItem key={c.value} value={c.value}>
                        {c.label}
                    </MenuItem>
                   ))}
        </TextField><br />

      </form>
    )
  }
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)