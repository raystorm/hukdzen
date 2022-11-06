import React, { useState, useEffect, ReactEventHandler } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import { TextField, MenuItem, Button, ClassNameMap } from '@mui/material';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { userActions } from '../../User/userSlice';
import { Role, RoleType, Xbiis } from '../../Box/boxTypes';


interface BoxFormProps 
{
   box: Xbiis;
}

const roles = [
    { value: Role.ReadOnly.name,     label: Role.ReadOnly.toString(), },
    { value: Role.Write.name,        label: Role.Write.toString(), },
];

const BoxForm: React.FC<BoxFormProps> = (props) =>
{
  //TODO: load current User
  let { box } = props;

  const [id,          setId]          = useState(box.id);
  const [name,        setName]        = useState(box.name);
  const [ownerId,     setOwnerId]     = useState(box.ownerId);
  const [defaultRole, setDefaultRole] = useState(box.defaultRole? 
                                           box.defaultRole.name : '');

  useEffect(() => {
    setId(box.id);
    setName(box.name);
    setOwnerId(box.ownerId);
    setDefaultRole(box.defaultRole? box.defaultRole.name : '');
  }, [box]);

  //Should this method be passed as part of props?
  const hanldeBoxUpdate = () =>
  { 
    //build user, dispatch
    ReduxStore.dispatch(userActions.setSpecifiedUser(box));
  }

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
    setDefaultRole(chosenRole? chosenRole.name : '');
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
              <TextField name='ownerId' label='Owner' required
                         value={ownerId}
                         onChange={e => setOwnerId(e.target.value)}
                         />
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
              <TextField name='defaultRole'  label='Default Role' select
                        style={{minWidth: '14.5em'}} 
                        value={defaultRole} onChange={(e) => handleSelectRole(e)} >
                        { roles.map((c) => (
                            <MenuItem key={c.value} value={c.value}>
                                {c.label}
                            </MenuItem>
                        ))}
              </TextField>
           </div>
        </div>
        <Button onClick={() => {return hanldeBoxUpdate()}}
                variant='contained' >Save</Button>
        <Button onClick={() => {return hanldeBoxUpdate()}}
                variant='contained' >Save</Button>        
      </form>
    );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxForm)