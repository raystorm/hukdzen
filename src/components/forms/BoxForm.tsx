import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete, Button, MenuItem, TextField, Divider } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';

import { useAppSelector } from '../../app/hooks';
import type { Xbiis } from '../../Box/boxTypes';
import { emptyXbiis, BoxPurpose, AccessLevel } from '../../Box/boxTypes';
import { printRole, Role, rolesList } from '../../Role/roleTypes';
import { boxActions } from '../../Box/boxSlice';
import { printGyet } from "../../Gyet/GyetType";
import { userListActions } from '../../User/UserList/userListSlice';
import { theme } from "../shared/theme";
import { isDefaultBox } from "../../Box/boxRules";
import { BOX_MEMBERS_PATH } from '../shared/constants';


interface BoxFormProps 
{
   box?: Xbiis;
   isAdminForm?: boolean;
}

const roles = rolesList;

const BoxForm: React.FC<BoxFormProps> = (props) =>
{
  let { box = emptyXbiis, isAdminForm = false } = props;

  const dispatch = useDispatch();

  const usersList = useAppSelector(state => state.userList);

  useEffect(() => {
     //console.log(`userList: ${JSON.stringify(usersList)} ${usersList.items.length}`);
     if ( !usersList || !usersList.items || 0 === usersList.items.length )
     { dispatch(userListActions.getAllUsers()); }
  }, [usersList]);

  const [id,   setId]   = useState(box?.id);
  const [name, setName] = useState(box?.name);
  const [waa,  setWaa]  = useState(box?.waa || '');

  let own = box?.owner;
  if ( !box?.owner?.waa )
  {
    let ownIndex = usersList.items.findIndex(u =>
       !!u && !!box && !!box.owner && u.id === box.owner.id
    );
    if ( -1 < ownIndex ) { own = usersList.items[ownIndex]!; }
  }
  const [owner,       setOwner]       = useState(own);
  const [defaultRole, setDefaultRole] = useState(box?.defaultRole);

  useEffect(() =>
  {
    if ( !box ) { box = emptyXbiis; }
    setId(box.id);
    setName(box.name);
    setWaa(box.waa || '');

    let own = box.owner;
    setOwner(own);
    setDefaultRole(box.defaultRole);
  }, [box]);

  //Should this method be passed as part of props?
  const handleBoxUpdate = () => {

     const updateMe: Xbiis = {
        ...box,
        id:           id,
        name:         name,
        waa:          waa,
        owner:        owner,
        xbiisOwnerId: owner.id,
        purpose:      box.purpose,
        defaultRole:  defaultRole,
        updatedAt:    new Date().toISOString(),
     }

     dispatch(boxActions.updateBox(updateMe));
  }

  const hanldeBoxCreate = () => {
     const createMe: Xbiis = {
        __typename:   'Xbiis',
        id:           id,
        name:         name,
        waa:          waa,
        owner:        owner,
        xbiisOwnerId: owner.id,
        purpose:      BoxPurpose.GROUP,
        defaultRole:  defaultRole,
        createdAt:    new Date().toISOString(),
        updatedAt:    new Date().toISOString(),
     }
     dispatch(boxActions.createBox(createMe));
  }

  const handleSelectRole = (e: React.ChangeEvent<HTMLInputElement 
                                                |HTMLTextAreaElement>) => 
  {
    let chosenRole: AccessLevel | undefined = undefined;

    switch(e.target.value)
    {
       case Role.None.toString():
            chosenRole = Role.None;
            break;
       case Role.Read.toString():
            chosenRole = Role.Read;
            break;
       case Role.Write.toString():
            chosenRole = Role.Write;
            break;
       //default: Throw an error here
    }
    setDefaultRole(chosenRole);
  }

   return (
      <form>
        <h2>Box Information</h2>
        <TextField name='id' data-testid='id'
                   type='hidden' style={{display: 'none'}}
                   value={id} 
                   /* onChange={(e) => setId(e.target.value)} */ />
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' required
                         disabled={BoxPurpose.USER === box.purpose || isDefaultBox(box)}
                         value={name} onChange={(e) => setName(e.target.value)} />
              <Autocomplete
                  data-testid='owner-autocomplete'
                  value={owner} 
                  options={usersList.items}
                  disabled={BoxPurpose.USER === box.purpose || isDefaultBox(box)}
                  onChange={(e, v) => { !!v && setOwner(v)}}
                  getOptionLabel={user => printGyet(user)}
                  isOptionEqualToValue={(a, b) => a?.id === b?.id}
                  renderInput={(params) =>
                    <TextField {...params} required label='Owner' />
                  }
              />
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
              <TextField name='waa'  label='Waa'
                         disabled={isDefaultBox(box)}
                         value={waa} onChange={(e) => setWaa(e.target.value)} />
              <TextField name='defaultRole'  label='Default Role' select
                         data-testid='defaultRole'
                         style={{minWidth: '14.5em'}}
                         disabled={isDefaultBox(box)}
                         value={printRole(defaultRole)}
                         onChange={(e) => handleSelectRole(e)} >
                         { roles.map((c) => (
                             <MenuItem key={c.value} value={c.value}>
                                {c.label}
                             </MenuItem>
                         ))}
              </TextField>
           </div>
        </div>
        <Button onClick={() => {return handleBoxUpdate()}}
                variant='contained' sx={{m:2}} >Save</Button>
        <Button onClick={() => {return hanldeBoxCreate()}}
                variant='contained' sx={{m:2}} >Create</Button>
        <Divider orientation='vertical'
                 flexItem sx={{ mx: 1, borderWidth: 1, display: 'inline-block',
                                height: '2em', verticalAlign: 'middle' }} />
        <Button href={BOX_MEMBERS_PATH.replace(':id', id)}
                variant='contained' color='inherit'
                startIcon={<PeopleIcon />}
                sx={{m:2}} >Edit Members</Button>
        { isAdminForm &&
          <>
            <Divider orientation='vertical' flexItem
                     sx={{ mx: 1, borderWidth: 1, display: 'inline-block',
                           height: '2em', verticalAlign: 'middle' }} />
            <Button onClick={() => { dispatch(boxActions.removeBox(box)) }}
                    disabled={BoxPurpose.USER === box.purpose || isDefaultBox(box)}
                    style={{backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                            fontWeight: 'bold' }}
                    variant='contained' sx={{m:2}} >Delete</Button>
          </>
        }
      </form>
    );
};

export default BoxForm;