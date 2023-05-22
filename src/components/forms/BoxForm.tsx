import React, { useState, useEffect, ReactEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap, Autocomplete } from '@mui/material';

import { useAppSelector } from '../../app/hooks';
import { Xbiis } from '../../Box/boxTypes';
import { DefaultRole, printRole, Role, RoleType } from '../../Role/roleTypes';
import { boxActions } from '../../Box/boxSlice';
import { emptyGyigyet, gyigyet } from '../../User/UserList/userListType';
import {compareUser, emptyGyet, Gyet, printUser} from '../../User/userType';
import { compareBoxRole } from "../../User/BoxRoleType";
import { userListActions } from '../../User/UserList/userListSlice';


interface BoxFormProps 
{
   box: Xbiis;
}

const roles = [
    { value: Role.Read.toString(),  label: printRole(Role.Read),  },
    { value: Role.Write.toString(), label: printRole(Role.Write), },
];

const BoxForm: React.FC<BoxFormProps> = (props) =>
{
  //TODO: load current User
  let { box } = props;

  const dispatch = useDispatch();

  const usersList = useAppSelector(state => state.userList);

  useEffect(() => {
     if ( !usersList ) { dispatch(userListActions.getAllUsers(undefined)); }
  }, []);

  const [id,          setId]          = useState(box.id);
  const [name,        setName]        = useState(box.name);

  let own = box.owner;
  if ( !box.owner?.waa ) 
  {
    let ownIndex = usersList.items.findIndex(u =>
       !!u && !!box && !!box.owner && u.id === box.owner.id
    );
    if ( -1 < ownIndex ) { own = usersList.items[ownIndex]!; }
  }
  const [owner,       setOwner]       = useState(own);
  const [defaultRole, setDefaultRole] = useState(box.defaultRole);

  useEffect(() => {
    setId(box.id);
    setName(box.name);

    let own = box.owner;
    if ( !box.owner?.waa ) 
    {
      let ownIndex = usersList.items.findIndex(u => u?.id === box.owner.id);
      if ( -1 < ownIndex ) { own = usersList.items[ownIndex]!; }
    }
    setOwner(own);
    setDefaultRole(box.defaultRole);
  }, [box]);

  //Should this method be passed as part of props?
  const handleBoxUpdate = () => {

     const updateMe: Xbiis = {
        ...box,
        id:           id,
        name:         name,
        owner:        owner,
        xbiisOwnerId: owner.id,
        defaultRole:  defaultRole,
        updatedAt:    new Date().toISOString(),
     }

     dispatch(boxActions.updateSpecifiedBox(updateMe));
  }

  const hanldeBoxCreate = () => {
     const createMe: Xbiis = {
        __typename:   'Xbiis',
        id:           id,
        name:         name,
        owner:        owner,
        xbiisOwnerId: owner.id,
        defaultRole:  defaultRole,
        createdAt:    new Date().toISOString(),
        updatedAt:    new Date().toISOString(),
     }
     dispatch(boxActions.createBox(createMe));
  }

  const handleSelectRole = (e: React.ChangeEvent<HTMLInputElement 
                                                |HTMLTextAreaElement>) => 
  {
    let chosenRole: RoleType | undefined = undefined;

    switch(e.target.value)
    {
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
      //TODO: user form
      <form>
        <h2>Box Information</h2>
        <TextField name='id' data-testid='id'
                   type='hidden' style={{display: 'none'}}
                   value={id} 
                   /* onChange={(e) => setId(e.target.value)} */ />
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' required
                         value={name} onChange={(e) => setName(e.target.value)} />
              <Autocomplete
                  data-testid='owner-autocomplete'
                  value={owner} 
                  options={usersList.items}
                  onChange={(e, v) => { !!v && setOwner(v)}}
                  getOptionLabel={user => printUser(user)}
                  isOptionEqualToValue={(a, b) => a?.id === b?.id}
                  renderInput={(params) =>
                    <TextField {...params} required label='Owner' />
                  }
              />
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
              <TextField name='defaultRole'  label='Default Role' select
                         data-testid='defaultRole'
                        style={{minWidth: '14.5em'}} 
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
        <Button href={`/admin/box/${id}/members`}
                variant='outlined' sx={{m:2}} >Edit Members</Button>
      </form>
    );
};

export default BoxForm;