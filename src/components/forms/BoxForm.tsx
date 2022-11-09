import React, { useState, useEffect, ReactEventHandler } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap, Autocomplete } from '@mui/material';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { userActions } from '../../User/userSlice';
import { Xbiis } from '../../Box/boxTypes';
import { DefaultRole, printRole, Role, RoleType } from '../../Role/roleTypes';
import { boxActions } from '../../Box/boxSlice';
import { emptyGyigyet, gyigyet } from '../../User/UserList/userListType';
import { emptyGyet, printUser } from '../../User/userType';
import { userListActions } from '../../User/UserList/userListSlice';


interface BoxFormProps 
{
   box: Xbiis;
}

const roles = [
    { value: Role.ReadOnly.name, label: printRole(Role.ReadOnly), },
    { value: Role.Write.name,    label: printRole(Role.Write),    },
];

const BoxForm: React.FC<BoxFormProps> = (props) =>
{
  //TODO: load current User
  let { box } = props;

  const [id,          setId]          = useState(box.id);
  const [name,        setName]        = useState(box.name);
  const [owner,       setOwner]       = useState(box.owner);
  const [defaultRole, setDefaultRole] = useState(box.defaultRole);

  useEffect(() => {
    setId(box.id);
    setName(box.name);
    setOwner(box.owner);
    setDefaultRole(box.defaultRole);
  }, [box]);

  //TODO: load the
  const usersList = useSelector<ReduxState, gyigyet>(state => state.userList);

  //TODO: switch this to ondemand.
  useEffect(() => {
    ReduxStore.dispatch(userListActions.getAllUsers(undefined));
  });

  //Should this method be passed as part of props?
  const hanldeBoxUpdate = () =>
  { ReduxStore.dispatch(boxActions.setSpecifiedBox(box)); }

  const hanldeBoxCreate = () =>
  { ReduxStore.dispatch(boxActions.createBox(box)); }


  const handleSelectRole = (e: React.ChangeEvent<HTMLInputElement 
                                                |HTMLTextAreaElement>) => 
  {
    let chosenRole: RoleType | undefined = undefined;

    switch(e.target.value)
    {
       case Role.ReadOnly.name:
            chosenRole = Role.ReadOnly;
            break;
       case Role.Write.name:
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
        <TextField name='id' type='hidden' style={{display: 'none'}}
                   value={id} onChange={(e) => setId(e.target.value)} />
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' required
                         value={name} onChange={(e) => setName(e.target.value)} />
              {/* TODO: autocomplete from User List */}
              {/*
              <TextField name='ownerId' label='Owner' required
                         value={owner}
                         onChange={e => setOwner(e.target.value)}
                         />
              */}
              <Autocomplete
                  value={owner} 
                  options={usersList.users}
                  onChange={(e, v) => setOwner(v as any)}
                  getOptionLabel={user => printUser(user)}
                  renderInput={(params) =>
                    <TextField {...params} required label="Owner" />
                  }
              />
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
              <TextField name='defaultRole'  label='Default Role' select
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
        <Button onClick={() => {return hanldeBoxUpdate()}}
                variant='contained' sx={{m:2}} >Save</Button>
        <Button onClick={() => {return hanldeBoxCreate()}}
                variant='contained' sx={{m:2}} >Create</Button>
      </form>
    );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxForm)