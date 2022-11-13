import React, { useState, useEffect, } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { Autocomplete, TextField, MenuItem, Button, 
         Checkbox, FormControlLabel, Tooltip, 
         List, ListItem, ListItemIcon, ListItemText, Chip
       } from '@mui/material';
import { 
         AdminPanelSettings, 
         AdminPanelSettingsOutlined, 
         FolderSpecial } from '@mui/icons-material';
import * as yup from 'yup';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { BoxRole, printBoxRole,
         Gyet,Clan, ClanType, 
       } from '../../User/userType';
import { userActions } from '../../User/userSlice';
import { currentUserActions } from '../../User/currentUserSlice';
import { DefaultBox, Xbiis } from '../../Box/boxTypes';
import { BoxList } from '../../Box/BoxList/BoxListType';
import { DefaultRole, printRole, Role } from '../../Role/roleTypes';
import { boxListActions } from '../../Box/BoxList/BoxListSlice';


interface UserFormProps 
{
   user: Gyet;
}

const clans = [
    { value: Clan.Raven.name,       label: Clan.Raven.toString(), },
    { value: Clan.Eagle.name,       label: Clan.Eagle.toString(), },
    { value: Clan.Killerwhale.name, label: Clan.Killerwhale.toString(), },
    { value: Clan.Wolf.name,        label: Clan.Wolf.toString(), },
];

const UserForm: React.FC<UserFormProps> = (props) =>
{
  //TODO: load current User
  let { user } = props;

  useEffect(() => {
    ReduxStore.dispatch(boxListActions.getAllBoxes(undefined));
  }, []);

  const isDefault = (br: BoxRole) =>
  { return br.box.id === DefaultBox.id && br.role.name === DefaultRole.name }

  let boxes = useSelector<ReduxState, BoxList>(state => state.boxList);

  const fixedBR: BoxRole[] = [{ box: DefaultBox, role: DefaultRole }];

  const [id,         setId]         = useState(user.id);
  const [name,       setName]       = useState(user.name);
  const [email,      setEmail]      = useState(user.email);
  const [emailError, setEmailError] = useState('');
  const [isAdmin,    setIsAdmin]    = useState(undefined === user.isAdmin ? false : user.isAdmin);
  const [waa,        setWaa]        = useState(user.waa? user.waa : '' );
  const [userClan,   setClan]       = useState(user.clan? user.clan.name : '');
  let tempBR = [...fixedBR];
  if ( user.boxRoles ) { tempBR.push(...user.boxRoles); }
  const [boxRoles,   setBoxRoles]   = useState(tempBR);

  useEffect(() => {
    setId(user.id);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(undefined === user.isAdmin ? false : user.isAdmin);
    setEmailError(''); //assume valid
    setWaa((user.waa ? user.waa : ''));
    setClan(user.clan? user.clan.name : '');

    let filledInBoxRole: BoxRole[] = []//...fixedBR, ...user.boxRoles];
    filledInBoxRole.push(...fixedBR);
    if ( user.boxRoles )
    {
      boxes.boxes.forEach(bx => {
        if ( isDefault({box: bx, role: DefaultRole}) ) { return; }
        const ibr = user.boxRoles.findIndex(ubr => ubr.box.id === bx.id);
        if ( -1 < ibr ) 
        { filledInBoxRole.push({ box: bx, role: user.boxRoles[ibr].role}) }      
      });
      //filledInBoxRole.push(...user.boxRoles);
    }
    setBoxRoles(filledInBoxRole);
  }, [user]);

  const currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);

  let allBoxRoles: BoxRole[] = [];
  if ( boxes.boxes )
  {
    boxes.boxes.forEach((box) => {
      if ( DefaultBox.id === box.id ) { return; }
      const write = { box: box, role: Role.Write,    };
      const read  = { box: box, role: Role.ReadOnly, };
      allBoxRoles.push(write);
      allBoxRoles.push(read);      
    });
  }

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

  const isSelected = (br: BoxRole, userBR: BoxRole[]) =>
  {
    const foundBr = userBR.find((b) =>( b.box.id === br.box.id
                                     && b.role.name === br.role.name));
    if (foundBr) { return true; }
    //NOTE: may need logic here, if no default Write for user
    if ( br.box.id === DefaultBox.id && br.role.name === DefaultRole.name )
    { return true; }

    return false;
  }

  let rolesDisplay: JSX.Element;
  if ( currentUser.isAdmin && boxes.boxes )
  { //TODO: flesh out Skeleton BR from IDs in UserType
    rolesDisplay = <Autocomplete multiple options={allBoxRoles}
                      value={boxRoles} disableCloseOnSelect
                      onChange={(event, newVal) => {
                        setBoxRoles([
                          ...fixedBR,
                          ...newVal.filter((br) => !isDefault(br))
                        ]);
                      }}
                      getOptionLabel={(br) => { return printBoxRole(br);}}
                      renderOption={(props, br, { selected }) => (
                          //TODO: look into grouping, can be READ OR WRITE, not both
                          <li {...props}>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={ selected || isSelected(br, boxRoles) }
                              disabled={ isDefault(br) }
                            />
                            {br.box.name}
                            <em style={{marginLeft: '.5em'}}>({br.role.name})</em>
                          </li>
                      )}

                      renderInput={(params) => (
                        <TextField {...params} label="Boxes" />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((br, index) => (
                          <Chip label={printBoxRole(br)} 
                                {...getTagProps({ index })}
                                disabled={isDefault(br)}
                          />
                        ))
                      }
                      //todo: fix min width to be use full
                      style={{width: '15em'}}
                   />
  }
  else
  {    
    //console.log('boxes:\n '+JSON.stringify(boxes));
    //console.log('boxes.boxes:\n '+JSON.stringify(boxes["boxes"]));
    rolesDisplay = <div>
                    <p>Boxes w/ Access</p>
                    { boxRoles &&
                    <List>
                    {
                      boxRoles.map((br) => {
                        return (
                        <ListItem dense>
                          <ListItemIcon><FolderSpecial /></ListItemIcon>
                          <ListItemText primary={br.box.name}
                                        secondary={printRole(br.role)} />
                          </ListItem>);
                      })
                    }
                    </List>
                    }
                  </div>
  }

  return (
      <form>
        <h2>'Nii int dzabt (User Information)</h2>
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
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>             
              <Tooltip 
                 title={`User ${isAdmin? 'has' : 'does not have'} admin access.`} >
                  <FormControlLabel label='Miyaan (Admin)'
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
           <div style={{textAlign: 'left'}}>
             {rolesDisplay}
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