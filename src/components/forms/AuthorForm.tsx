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
import {Clans, ClanEnum, getClanFromName, printClanType} from "../../Gyet/ClanType";
import {Author, emptyAuthor} from "../../Author/AuthorType";
import {authorActions} from "../../Author/authorSlice";


export interface AuthorFormProps
{
   author:     Author;
   isNew?:     boolean;
   setAuthor?: (author: Author) => void;
};

//should this be in ClanType.ts
const clans = [
    { value: Clans.Raven.name, label: printClanType(Clans.Raven), },
    { value: Clans.Eagle.name, label: printClanType(Clans.Eagle), },
    { value: Clans.Orca.name,  label: printClanType(Clans.Orca),  },
    { value: Clans.Wolf.name,  label: printClanType(Clans.Wolf),  },
];

//TODO: localize this
export const AuthorFormTitle = "'Nii int t'amt dzabt (Author Information)";

const AuthorForm: React.FC<AuthorFormProps> = (props) =>
{
  const dispatch = useDispatch();

  const { author, isNew = false, setAuthor } = props;

  const [id,         setId]         = useState(author.id);
  const [name,       setName]       = useState(author.name);
  const [email,      setEmail]      = useState(author.email);
  const [emailError, setEmailError] = useState('');
  const [waa,        setWaa]        = useState(author.waa ? author.waa : '' );
  const [userClan,   setClan]       = useState(author.clan ? author.clan : '');

  const [createdAt, setCreatedAt]  = useState(author.createdAt);

  useEffect(() => {
    console.log('Processing Author Change.');
    setId(author.id);
    setName(author.name);
    setEmail(author.email);
    setEmailError(''); //assume valid
    setWaa((author.waa ? author.waa : ''));
    setClan(author.clan ? author.clan : '');
  }, [author]);

  const handleEmailUpdate = (e: string) =>
  {
    yup.string().required("Email Required").email("Invalid Email format.")
       .validate(email)
       .then(() => { setEmailError('') }, 
             (err: yup.ValidationError) => { setEmailError(err.message); });
    setEmail(e);
  }

  //Should this method be passed as part of props?
  const handleAuthorForm = (e: React.FormEvent<HTMLFormElement>) =>
  { 
    e.preventDefault();

    //check for validation errors.
    if ( '' !== emailError ) { return; }

    //build author,
    const useAuthor : Author = {
      __typename: 'Author',
      id:        id,
      name:      name,
      email:     email,
      waa:       waa,
      clan:      getClanFromName(userClan)?.value,
      createdAt: createdAt,
      updatedAt: new Date().toISOString(),
    };

    if ( isNew )
    {
       useAuthor.createdAt = new Date().toISOString();
       dispatch(authorActions.createAuthor(useAuthor));
       return;
    }

    dispatch(authorActions.updateAuthor(useAuthor));
  }

  const handleSelectClan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
  {
    let chosenClan = getClanFromName(e.target.value);
    //setClan(chosenClan);
    setClan(chosenClan? chosenClan.value : '');

     if ( setAuthor )
     {
        setAuthor({
           ...author,
           name:  name,
           email: email,
           waa:   waa,
           clan:  chosenClan?.value,
           updatedAt: new Date().toISOString(),
        });
     }
  }

  const handleTextFieldUpdate = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const field = e.target.name;
    const value = e.target.value;

    switch (field)
    {
       case 'name':
          setName(value);
          break;
       case 'email':
          setEmail(value);
          break;
       case 'waa':
          setWaa(value);
          break;
    }
    if ( setAuthor )
    {
       setAuthor({
          ...author,
          name:  name,
          email: email,
          waa:   waa,
          updatedAt: new Date().toISOString(),
       });
    }
  }

  return (
      <form onSubmit={e => handleAuthorForm(e)}>
        <h2>{AuthorFormTitle}</h2>
        <TextField name='id' type='hidden' style={{display: 'none'}} 
                   data-testid='id' value={id} />
                   {/* onChange={(e) => setId(e.target.value)} /> */}
        <div className='twoColumn'>
           <div style={{display: 'inline-grid', maxWidth: '15em', justifySelf: 'right'}}>
              <TextField name='name'  label='Name' required
                         value={name} onChange={(e) => setName(e.target.value)} />
              <TextField name='email' label='E-Mail'
                         error={emailError!==''} helperText={emailError}
                         value={email} //onChange={(e) => setEmail(e.target.value)} />
                         onChange={e => handleEmailUpdate(e.target.value)}
                         />
           </div>
           <div style={{display: 'inline-grid', maxWidth: '15em'}}>
              <TextField name='waa'  label='Waa'
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
        </div>
        { !setAuthor &&
          <Button type='submit' variant='contained'>
            { isNew ? 'Create' : 'Update' }
          </Button>
        }
      </form>
    );
};

export default AuthorForm;