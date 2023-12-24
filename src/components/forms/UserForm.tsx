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
import {Clans, getClanFromName, printClanType} from "../../Gyet/ClanType";
import {DefaultBox, printXbiis} from '../../Box/boxTypes';
import { DefaultRole, printRole, Role } from '../../Role/roleTypes';

import { boxListActions } from '../../Box/BoxList/BoxListSlice';
import { userActions } from '../../User/userSlice';
import {BoxUserList, emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser, printBoxRoleFromBoxUser} from "../../BoxUser/BoxUserType";
import {boxUserListActions} from "../../BoxUser/BoxUserList/BoxUserListSlice";
import {theme} from "../shared/theme";


export interface UserFormProps
{
   user: User;
   isAdminForm?: boolean;
   isCreateForm?: boolean;
   additionalSaveAction?: () => void;
};

//should this be in ClanType.ts
const clans = [
    { value: Clans.Raven.value, label: printClanType(Clans.Raven), },
    { value: Clans.Eagle.value, label: printClanType(Clans.Eagle), },
    { value: Clans.Orca.value,  label: printClanType(Clans.Orca),  },
    { value: Clans.Wolf.value,  label: printClanType(Clans.Wolf),  },
];

//TODO: localize this
export const userFormTitle = "'Nii int dzabt (User Information)";

const UserForm: React.FC<UserFormProps> = (props) =>
{
  //TODO: load current User
  let { user, isAdminForm = false, isCreateForm = false } = props;

  const dispatch = useDispatch();

  const boxes    = useAppSelector(state => state.boxList);
  const boxUserList = useAppSelector(state => state.boxUserList);

  useEffect(() => {
    if ( isCreateForm ) { return; } //no list when creating.
    if ( !boxUserList || !boxUserList.items || 0 === boxUserList.items.length )
    { dispatch(boxUserListActions.getAllBoxUsersForUser(user)); }
    if ( !boxes || !boxes.items || 0 === boxes.items.length )
    { dispatch(boxListActions.getAllBoxes()); }
  }, []); //empty is intentional, (no looping until found)

  const isDefault = (bu: BoxUser | null) : boolean =>
  { return !!bu && bu.box.id === DefaultBox.id && bu.role === DefaultRole }

  const [id,         setId]         = useState(user.id);
  const [name,       setName]       = useState(user.name);
  const [email,      setEmail]      = useState(user.email);
  const [emailError, setEmailError] = useState('');
  const [isAdmin,    setIsAdmin]    = useState(undefined === user.isAdmin ? false : user.isAdmin);
  const [waa,        setWaa]        = useState(user.waa? user.waa : '' );
  const [userClan,   setClan]       = useState(user.clan? getClanFromName(user.clan) : '');
  const [boxUsers, setBoxUsers] = useState(boxUserList.items);
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

    //ensure boxList updates
     if ( !isCreateForm )
     { dispatch(boxUserListActions.getAllBoxUsersForUser(user)); }
  }, [user]);

  const buildAllBoxRoles = () => {
      const allBoxRoles: BoxUser[] = [];
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
      return allBoxRoles;
  };
  let allBoxRoles: BoxUser[] = buildAllBoxRoles();

  useEffect(() => { allBoxRoles = buildAllBoxRoles(); }, [boxes]);

  useEffect(() => { setBoxUsers(boxUserList.items); }, [boxUserList]);

  const currentUser = useAppSelector(state => state.currentUser);

  const handleEmailUpdate = (e: string) =>
  {
    yup.string().required("Email Required").email("Invalid Email format.")
       .validate(email)
       .then(() => { setEmailError('') }, 
             (err: yup.ValidationError) => { setEmailError(err.message); });
    setEmail(e);
  };

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
       // @ts-ignore //TODO: fix this and find out what is going on w/ the types
       clan:       getClanFromName(userClan)?.value,
       isAdmin:    isAdmin,
       createdAt:  createdAt,
       updatedAt:  new Date().toISOString(),
     };

     if ( isCreateForm )
     {
        console.log('creating user.')
        const createMe: User = {
           ...updateWith,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
        };
        dispatch(userActions.createUser(createMe));
     }
     else
     {
        console.log('updating user.')
        dispatch(userActions.updateUser(updateWith));
     }

     if ( boxUsersChanged )
     {
        //TODO: build boxUserRoles and dispatch
        //TODO: single transaction
        console.log('updating BoxUsersList');

        //build new BoxUser list
        const buList: BoxUserList = { ...emptyBoxUserList, items: [] };
        for (let bu of boxUsers ) { buList.items.push(bu); }
        dispatch(boxUserListActions.updateAllBoxUsersForUser(buList));
     }

     if ( props.additionalSaveAction ) { props.additionalSaveAction(); }
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
  {
    let chosenClan = getClanFromName(e.target.value);
    //setClan(chosenClan);
    setClan(chosenClan? chosenClan.value : '');
  }

  const isSelected = (bu: BoxUser | null, bUList: (BoxUser | null)[]) =>
  {
    const foundBr = bUList.find((b) =>(
      !!bu && !!b && b.box.id === bu.box.id && b.role === bu.role)
    );
    if (foundBr) { return true; }
    //NOTE: may need logic here, if no default Write for user
    return !!bu && bu.box.id === DefaultBox.id && bu.role === DefaultRole;
  }

  let rolesDisplay: JSX.Element;
  if ( currentUser.isAdmin && boxes && boxes.items )
  { //TODO: flesh out Skeleton BR from IDs in UserType
    rolesDisplay = <Autocomplete data-testid='boxes-autocomplete'
                      multiple options={allBoxRoles}
                      value={boxUsers} disableCloseOnSelect
                      onChange={(event, newVal) => {
                        console.log(`Changing Role to: ${JSON.stringify(newVal)}`);
                        setBoxUsersChanged(true);
                        setBoxUsers([
                          ...newVal.filter((br) => !isDefault(br))
                        ]);
                      }}
                      isOptionEqualToValue={(a,b) => {
                         return !!a && !!b && a.box.id === b.box?.id && a.role === b.role;
                      }}
                      getOptionLabel={(br) => { return printBoxRoleFromBoxUser(br);}}
                      renderOption={(props, br, { selected }) => (
                          //TODO: look into grouping, can be READ OR WRITE, not both
                          <li {...props}>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={ selected || isSelected(br, boxUsers) }
                              disabled={ isDefault(br) }
                            />
                             {/*printBoxRoleFromBoxUser(br)*/}
                             { br && printXbiis(br.box)} |
                             <em style={{marginLeft: '.5em'}}>{br && br.role}</em>
                          </li>
                      )}

                      renderInput={(params) => (
                        <TextField {...params} name='boxRoles' label="Boxes" />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((br, index) => (
                           <Tooltip title={br ? printBoxRoleFromBoxUser(br) : ''}>
                              <Chip label={br ? printBoxRoleFromBoxUser(br) : ''}
                                    {...getTagProps({ index })}
                                    disabled={br ? isDefault(br): true}
                              />
                           </Tooltip>
                        ))
                      }
                      //todo: fix min width to be use full
                      style={{width: '20em'}}
                   />
  }
  else if ( isCreateForm ) { rolesDisplay = <></> }
  else
  {
    rolesDisplay = <div>
                    <p>Boxes w/ Access</p>
                    { boxUsers &&
                    <List>
                    {
                      boxUsers.map((br) => {
                        if ( !br ) { return <></>; }
                        return (
                          <ListItem key={`br-${br.box.name}`} dense>
                            <ListItemIcon key={`br-${br.box.name}-icon`}>
                              <FolderSpecial />
                            </ListItemIcon>
                            <ListItemText key={`br-${br.box.name}-values`}
                                          primary={printXbiis(br.box)}
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
                         value={userClan}
                         onChange={(e) => handleSelectClan(e)}
              >
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
                           margin: theme.spacing(1),
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