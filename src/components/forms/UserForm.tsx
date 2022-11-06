import React, { useState, useEffect, ReactEventHandler } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import * as yup from 'yup';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { Clan, ClanType, Gyet } from '../../User/userType';
import { userActions } from '../../User/userSlice';
import { currentUserActions } from '../../User/currentUserSlice';
import { AdminPanelSettings, AdminPanelSettingsOutlined } from '@mui/icons-material';


interface UserFormProps 
{
   user: Gyet;
}

const clans = [
    { value: Clan.Raven.name,        label: Clan.Raven.toString(), },
    { value: Clan.Eagle.name,        label: Clan.Eagle.toString(), },
    { value: Clan.Killerwhale.name,  label: Clan.Killerwhale.toString(), },
    { value: Clan.Wolf.name,         label: Clan.Wolf.toString(), },
];

const UserForm: React.FC<UserFormProps> = (props) =>
{
  //TODO: load current User
  let { user } = props;

  const [id,         setId]         = useState(user.id);
  const [name,       setName]       = useState(user.name);
  const [email,      setEmail]      = useState(user.email);
  const [emailError, setEmailError] = useState('');
  const [isAdmin,    setIsAdmin]    = useState(undefined === user.isAdmin ? false : user.isAdmin);
  const [waa,        setWaa]        = useState(user.waa? user.waa : '' );
  const [userClan,   setClan]       = useState(user.clan? user.clan.name : '');

  useEffect(() => {
    setId(user.id);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(undefined === user.isAdmin ? false : user.isAdmin);
    setEmailError(''); //assume valid
    setWaa((user.waa ? user.waa : ''));
    setClan(user.clan? user.clan.name : '');
  }, [user]);

  const currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);
  
  const handleEmailUpdate = (e: string) =>
  {
    yup.string().required("Email Required").email("Invalid Email format.")
       .validate(email)
       .then(() => { setEmailError('') }, 
             (err: yup.ValidationError) => { setEmailError(err.message); });
    setEmail(e);
  }

  //Should this method be passed as part of props?
  const hanldeUserUpdate = () =>
  { 
    //build user, dispatch
    ReduxStore.dispatch(userActions.setSpecifiedUser(user));
    if ( user === ReduxStore.getState().currentUser ) //verify this
    { ReduxStore.dispatch(currentUserActions.setCurrentUser(user)); }
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
  {
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
       //default: Throw an error here
    }
    //setClan(chosenClan);
    setClan(chosenClan? chosenClan.name : '');
  }

  return (
      //TODO: user form
      <form>
        <h2>User Information</h2>
        <TextField name='id' type='hidden' style={{display: 'none'}}
                   value={id} onChange={(e) => setId(e.target.value)} />
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' 
                         value={name} onChange={(e) => setName(e.target.value)} />
              <TextField name='email' label='E-Mail' required 
                         error={emailError!==''} helperText={emailError}
                         value={email} //onChange={(e) => setEmail(e.target.value)} />
                         onChange={e => handleEmailUpdate(e.target.value)}
                         />
              <Tooltip 
                 title={`User ${isAdmin? 'has' : 'does not have'} admin access.`} >
                  <FormControlLabel label='Admin'              
                      control={<Checkbox name='isAdmin' 
                      disabled={!currentUser.isAdmin}
                      checked={!!isAdmin}
                      checkedIcon={<AdminPanelSettings />}
                      icon={<AdminPanelSettingsOutlined />}
                      onChange={e => { setIsAdmin(!isAdmin) } }
                      />} 
                  />
              </Tooltip>                              
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserForm)