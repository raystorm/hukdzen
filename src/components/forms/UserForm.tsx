import React, { useState, useEffect, } from 'react';
import { useDispatch} from 'react-redux';
import { Autocomplete, TextField, MenuItem, Button, 
         Checkbox, FormControlLabel, Tooltip, 
         List, ListItem, ListItemIcon, ListItemText, Chip
       } from '@mui/material';
import { AdminPanelSettings, 
         AdminPanelSettingsOutlined, 
         FolderSpecial } from '@mui/icons-material';
import * as yup from 'yup';

import { useAppSelector } from '../../app/hooks';

import { User, } from '../../User/userType';
import { Clans, ClanEnum, getClanFromName } from "../../Gyet/ClanType";
import { DefaultBox, Xbiis } from '../../Box/boxTypes';
import { DefaultRole, printRole, Role } from '../../Role/roleTypes';

import { boxListActions } from '../../Box/BoxList/BoxListSlice';
import { userActions } from '../../User/userSlice';
import { currentUserActions } from '../../User/currentUserSlice';
import {BoxUserList, emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser, printBoxRoleFromBoxUser} from "../../BoxUser/BoxUserType";
import {boxUserActions} from "../../BoxUser/BoxUserSlice";
import boxUserListSlice, {boxUserListActions} from "../../BoxUser/BoxUserList/BoxUserListSlice";
import {Person} from "../../Gyet/GyetType";
import {theme} from "../shared/theme";


export interface UserFormProps
{
   user: User;
   isAdminForm?: boolean;
};

//should this be in ClanType.ts
const clans = [
    { value: Clans.Raven.name, label: Clans.Raven.toString(), },
    { value: Clans.Eagle.name, label: Clans.Eagle.toString(), },
    { value: Clans.Orca.name,  label: Clans.Orca.toString(),  },
    { value: Clans.Wolf.name,  label: Clans.Wolf.toString(),  },
];

//TODO: localize this
export const userFormTitle = "'Nii int dzabt (User Information)";

const UserForm: React.FC<UserFormProps> = (props) =>
{
  //TODO: load current User
  let { user, isAdminForm = false } = props;

  const dispatch = useDispatch();

  const boxes    = useAppSelector(state => state.boxList);
  const boxUserList = useAppSelector(state => state.boxUserList);

  useEffect(() => {
    if ( !boxUserList || !boxUserList.items || boxUserList.items.length < 1 )
    { dispatch(boxUserListActions.getAllBoxUsersForUser(user)); }
  }, []);

  /*
  useEffect(() => {
    if ( !boxes || !boxes.items || boxes.items.length < 1 )
    { dispatch(boxListActions.getAllBoxes()); }
  }, [boxes]);
  */

  const isDefault = (bu: BoxUser) =>
  { return bu.box.id === DefaultBox.id && bu.role === DefaultRole }

  const fixedBR: BoxUser[] = [buildBoxUser(user, DefaultBox, DefaultRole)];

  const [id,         setId]         = useState(user.id);
  const [name,       setName]       = useState(user.name);
  const [email,      setEmail]      = useState(user.email);
  const [emailError, setEmailError] = useState('');
  const [isAdmin,    setIsAdmin]    = useState(undefined === user.isAdmin ? false : user.isAdmin);
  const [waa,        setWaa]        = useState(user.waa? user.waa : '' );
  const [userClan,   setClan]       = useState(user.clan? user.clan : '');
  let tempBR = [...fixedBR];
  if ( boxUserList.items )
  { for (let bu of boxUserList.items) { if (bu) { tempBR.push(bu?.boxRole); } } }
  const [boxUsers, setBoxUsers] = useState(tempBR);
  const [boxUsersChanged, setBoxUsersChanged] = useState(false);

  const [createdAt, setCreatedAt]  = useState(user.createdAt);

  useEffect(() => {
    setId(user.id);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(undefined === user.isAdmin ? false : user.isAdmin);
    setEmailError(''); //assume valid
    setWaa((user.waa ? user.waa : ''));
    setClan(user.clan? user.clan : '');
  }, [user]);

  useEffect(() => {
     let filledInBoxRole: BoxUser[] = [];
     filledInBoxRole.push(...fixedBR);
     boxUserList.items.forEach(bu =>
     {
        if ( !bu || isDefault(bu) ) { return; }
        filledInBoxRole.push(bu);
     });
     setBoxUsers(filledInBoxRole);
  }, [boxUserList]);

  const currentUser = useAppSelector(state => state.currentUser);

  let allBoxRoles: BoxUser[] = [];
  if ( boxes.items )
  {
    boxes.items.forEach((box) => {
      if ( !box || DefaultBox.id === box.id ) { return; }
      const write = buildBoxUser(user, box, Role.Write);
      const read  = buildBoxUser(user, box, Role.Read);
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
  const handleUserUpdate = (e: React.FormEvent<HTMLFormElement>) =>
  { 
    e.preventDefault();

    //check for validation errors.
    if ( '' !== emailError ) { return; }

    //build user,
    const updateWith : User = {
      __typename: 'User',
      id:         id,
      name:       name,
      email:      email,
      waa:        waa,
      clan:       getClanFromName(userClan)?.value,
      isAdmin:    isAdmin,
      createdAt:  createdAt,
      updatedAt:  new Date().toISOString(),
    };

    console.log('updating user.')
    dispatch(userActions.updateUser(updateWith));

     if ( boxUsersChanged )
     {
        //TODO: build boxUserRoles and dispatch
        //TODO: single transaction

        //build new BoxUser list
        const buList: BoxUserList = { ...emptyBoxUserList, items: [] };
        for (let bu of boxUsers ) { buList.items.push(bu); }
        dispatch(boxUserListActions.updateAllBoxUsersForUser(buList));
     }
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
  {
    let chosenClan = getClanFromName(e.target.value);
    //setClan(chosenClan);
    setClan(chosenClan? chosenClan.value : '');
  }

  const isSelected = (bu: BoxUser, bUList: BoxUser[]) =>
  {
    const foundBr = bUList.find((b) =>(
       b.box.id === bu.box.id && b.role === bu.role)
    );
    if (foundBr) { return true; }
    //NOTE: may need logic here, if no default Write for user
    if ( bu.box.id === DefaultBox.id && bu.role === DefaultRole )
    { return true; }

    return false;
  }

  let rolesDisplay: JSX.Element;
  if ( currentUser.isAdmin && boxes.items )
  { //TODO: flesh out Skeleton BR from IDs in UserType
    rolesDisplay = <Autocomplete data-testid='boxes-autocomplete'
                      multiple options={allBoxRoles}
                      value={boxUsers} disableCloseOnSelect
                      onChange={(event, newVal) => {
                        setBoxUsersChanged(true);
                        setBoxUsers([
                          ...fixedBR,
                          ...newVal.filter((br) => !isDefault(br))
                        ]);
                      }}
                      isOptionEqualToValue={(a,b) => { return (a.box.id === b.box.id && a.role === b.role) }}
                      getOptionLabel={(br) => { return printBoxRoleFromBoxUser(br);}}
                      renderOption={(props, br, { selected }) => (
                          //TODO: look into grouping, can be READ OR WRITE, not both
                          <li {...props}>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={ selected || isSelected(br, boxUsers) }
                              disabled={ isDefault(br) }
                            />
                            {br.box.name}
                            <em style={{marginLeft: '.5em'}}>({br.role})</em>
                          </li>
                      )}

                      renderInput={(params) => (
                        <TextField {...params} name='boxRoles' label="Boxes" />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((br, index) => (
                          <Chip label={printBoxRoleFromBoxUser(br)}
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
    rolesDisplay = <div>
                    <p>Boxes w/ Access</p>
                    { boxUsers &&
                    <List>
                    {
                      boxUsers.map((br) => {
                        return (
                          <ListItem key={`br-${br.box.name}`} dense>
                            <ListItemIcon key={`br-${br.box.name}-icon`}>
                              <FolderSpecial />
                            </ListItemIcon>
                            <ListItemText key={`br-${br.box.name}-values`}
                                          primary={br.box.name}
                                          secondary={printRole(br.role)} />
                          </ListItem>);
                      })
                    }
                    </List>
                    }
                  </div>
  }

  return (
      <form onSubmit={e => handleUserUpdate(e)}>
        <h2>{userFormTitle}</h2>
        <TextField name='id' type='hidden' style={{display: 'none'}} 
                   data-testid='id' value={id} />
                   {/* onChange={(e) => setId(e.target.value)} /> */}
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' required
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
              <TextField name='clan' data-testid='clan' label='Clan' select
                        style={{minWidth: '14.5em'}}
                        value={userClan} onChange={(e) => handleSelectClan(e)} >
                            <MenuItem key='' value=''>&nbsp;</MenuItem>
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
        <Button type='submit' variant='contained' >Save</Button>
        {
           isAdminForm &&
           <Button type='button' variant='contained'
                   style={{backgroundColor: theme.palette.secondary.main,
                           margin: theme.spacing(1), //TODO: use spacing
                          }}
                   onClick={() => {
                      console.log(`removing user: ${JSON.stringify(user)}`)
                      dispatch(userActions.removeUser(user));
                   }}
           >DELETE</Button>
        }
      </form>
    );
};

export default UserForm;