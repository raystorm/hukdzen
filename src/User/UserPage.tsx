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
  let user = useSelector<ReduxState, Gyet>(state => state.user);

  const [id,       setId]    = useState(user.id);
  const [name,     setName]  = useState(user.name);
  const [email,    setEmail] = useState(user.email);
  const [waa,      setWaa]   = useState(user.waa);
  const [userClan, setClan]  = useState(user.clan);

  
  const hanldeUserUpdate = () =>
  { //build user, dispatch
    ReduxStore.dispatch(userActions.setCurrentUser(user));
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let chosenClan: ClanType | undefined = undefined;

    switch(e.target.value)
    {
       case Clan.Raven.name:
            chosenClan = Clan.Raven;
            break;
       case Clan.Eagle.name:
            chosenClan = Clan.Eagle;
            break;
       case Clan.Killerwhale.name:
            chosenClan = Clan.Killerwhale;
            break;
       case Clan.Wolf.name:
            chosenClan = Clan.Wolf;
            break;
    }
    setClan(chosenClan);
  }

  return (
      //TODO: user form
      <form>
        <h2>User Information</h2>
        <TextField name='id' type='hidden' style={{display: 'none'}}
                   value={id} onChange={(e) => setId(e.target.value)} />
        <div style={{ maxWidth: '50em', margin: 'auto', }}>
           <div className='left'>
              <TextField name='name'  label='Name' 
                   value={name} onChange={(e) => setName(e.target.value)} />
              <TextField name='email' label='E-Mail' 
                   value={email} onChange={(e) => setEmail(e.target.value)} />
           </div>
           <div className='right'>
              <TextField name='waa'   label='Waa' 
                   value={waa} onChange={(e) => setWaa(e.target.value)} />
              <TextField name='clan'  label='Clan' select
                        style={{minWidth: '14.5em'}} 
                        value={userClan} onChange={(e) => handleSelectClan(e)} >
                        { clans.map((c) => (
                            <MenuItem key={c.value} value={c.value}>
                                {c.label}
                            </MenuItem>
                        ))}
              </TextField>
           </div>
        </div>
        <Button onClick={() => {return hanldeUserUpdate()}}
           variant='contained' >Save</Button>
      </form>
    );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)