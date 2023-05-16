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
import ReduxStore from '../../app/store';

import { Gyet, } from '../../User/userType';
import { Clan, ClanType, getClanFromName } from "../../User/ClanType";
import {BoxRole, BoxRoleBuilder, printBoxRole} from "../../User/BoxRoleType";
import { DefaultBox, Xbiis } from '../../Box/boxTypes';
import { DefaultRole, printRole, Role } from '../../Role/roleTypes';

import { boxListActions } from '../../Box/BoxList/BoxListSlice';
import { userActions } from '../../User/userSlice';
import { currentUserActions } from '../../User/currentUserSlice';


export interface UserFormProps 
{
   user: Gyet;
};

//should this be in ClanType.ts
const clans = [
    { value: Clan.Raven.name,       label: Clan.Raven.toString(), },
    { value: Clan.Eagle.name,       label: Clan.Eagle.toString(), },
    { value: Clan.Killerwhale.name, label: Clan.Killerwhale.toString(), },
    { value: Clan.Wolf.name,        label: Clan.Wolf.toString(), },
];

//TODO: localize this
export const userFormTitle = "'Nii int dzabt (User Information)";

const UserForm: React.FC<UserFormProps> = (props) =>
{
  //TODO: load current User
  let { user } = props;

  const dispatch = useDispatch();

  useEffect(() => { dispatch(boxListActions.getAllBoxes('')); }, []);

  const isDefault = (br: BoxRole) =>
  { return br.box.id === DefaultBox.id && br.role === DefaultRole }

  let boxes = useAppSelector(state => state.boxList);

  const fixedBR: BoxRole[] = [BoxRoleBuilder(DefaultBox, DefaultRole)];

  const [id,         setId]         = useState(user.id);
  const [name,       setName]       = useState(user.name);
  const [email,      setEmail]      = useState(user.email);
  const [emailError, setEmailError] = useState('');
  const [isAdmin,    setIsAdmin]    = useState(undefined === user.isAdmin ? false : user.isAdmin);
  const [waa,        setWaa]        = useState(user.waa? user.waa : '' );
  const [userClan,   setClan]       = useState(user.clan? user.clan.name : '');
  let tempBR = [...fixedBR];
  if ( user.boxRoles?.items )
  {  //@ts-ignore
     tempBR.push(...user.boxRoles.items);
  }
  const [boxRoles, setBoxRoles] = useState(tempBR);
  const [createdAt, setCreatedAt]  = useState(user.createdAt);

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
       boxes.items.forEach(bx =>
       {
         if ( !bx || isDefault(BoxRoleBuilder(bx, DefaultRole)) ) { return; }
         if ( user.boxRoles )
         {
            const ibr = user.boxRoles!.items
                                              .findIndex(ubr => ubr!.box.id === bx.id);
            if ( -1 < ibr )
            { filledInBoxRole.push(BoxRoleBuilder(bx, user.boxRoles!.items[ibr]!.role)) }
         }
       });
       //filledInBoxRole.push(...user.boxRoles);
    }
    setBoxRoles(filledInBoxRole);
  }, [user]);

  const currentUser = useAppSelector(state => state.currentUser);

  let allBoxRoles: BoxRole[] = [];
  if ( boxes.items )
  {
    boxes.items.forEach((box) => {
      if ( !box || DefaultBox.id === box.id ) { return; }
      const write = BoxRoleBuilder(box, Role.Write);
      const read  = BoxRoleBuilder(box, Role.Read);
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
  const hanldeUserUpdate = (e: React.FormEvent<HTMLFormElement>) =>
  { 
    e.preventDefault();

    //check for validation errors.
    if ( '' !== emailError ) { return; }
    
    //build user,
    const updateWith : Gyet = {
      __typename: 'Gyet',
      id:       id,
      name:     name,
      email:    email,
      waa:      waa,
      clan:     getClanFromName(userClan),
      isAdmin:  isAdmin,
      boxRoles: {
         __typename: "ModelBoxRoleConnection",
         items: boxRoles,
      },
      createdAt: createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    //dispatch
    dispatch(userActions.updateSpecifiedUser(updateWith));
    dispatch(userActions.setSpecifiedUser(updateWith));
    if ( updateWith.id === ReduxStore.getState().currentUser.id ) //verify this
    { dispatch(currentUserActions.setCurrentUser(updateWith)); }
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
  {
    let chosenClan: ClanType | undefined = undefined;

    chosenClan = getClanFromName(e.target.value);
    //setClan(chosenClan);
    setClan(chosenClan? chosenClan.name : '');
  }

  const isSelected = (br: BoxRole, userBR: BoxRole[]) =>
  {
    const foundBr = userBR.find((b) =>( b.box.id === br.box.id
                                     && b.role === br.role));
    if (foundBr) { return true; }
    //NOTE: may need logic here, if no default Write for user
    if ( br.box.id === DefaultBox.id && br.role === DefaultRole )
    { return true; }

    return false;
  }

  let rolesDisplay: JSX.Element;
  if ( currentUser.isAdmin && boxes.items )
  { //TODO: flesh out Skeleton BR from IDs in UserType
    rolesDisplay = <Autocomplete data-testid='boxes-autocomplete'
                      multiple options={allBoxRoles}
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
                            <em style={{marginLeft: '.5em'}}>({br.role})</em>
                          </li>
                      )}

                      renderInput={(params) => (
                        <TextField {...params} name='boxRoles' label="Boxes" />
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
      <form onSubmit={e => hanldeUserUpdate(e)}>
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
      </form>
    );
};

export default UserForm;