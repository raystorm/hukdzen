//import * as React from 'react';
import react, {useState, FormEvent, useEffect} from "react";
import { useDispatch } from "react-redux";

import { v4 as randomUUID } from "uuid";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {Author, emptyAuthor} from "../../Author/AuthorType";
import {useAppSelector} from "../../app/hooks";
import {printGyet} from "../../Gyet/GyetType";

import {authorActions} from "../../Author/authorSlice";
import AuthorForm from "../forms/AuthorForm";
import {authorListActions} from "../../Author/AuthorList/authorListSlice";
import {Tooltip} from "@mui/material";

const filter = createFilterOptions<Author>();

export interface AuthorInputProps {
   author: Author,
   setAuthor: (author: Author) => void,
   name: string,
   label: string,
   tooltip: string
}

export const AuthorInput = (props: AuthorInputProps) =>
{
   const dispatch = useDispatch();

   const { author, setAuthor, name, label, tooltip } = props;
   const authorList = useAppSelector(state => state.authorList);
   const [useAuthor, setUseAuthor] = useState(author);
   const [open, toggleOpen] = useState(false);

   useEffect(() => {
      dispatch(authorListActions.getAllAuthors());
   }, []);

   const handleClose = () => {
      setDialogValue(emptyAuthor);
      toggleOpen(false);
   };

   const [dialogValue, setDialogValue] = useState(emptyAuthor);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const createMe = { ...dialogValue, id: randomUUID(), };
      setUseAuthor(createMe);
      dispatch(authorActions.createAuthor(createMe));
      setAuthor(createMe);
      handleClose();
   };

   return (
      <>
         <Autocomplete
            id="author-autocomplete"
            value={useAuthor}
            onChange={(event, newValue) => {
               if ( !newValue )
               {
                  setUseAuthor(emptyAuthor);
                  if ( setAuthor ) { setAuthor(emptyAuthor); }
               }
               else if (typeof newValue === 'string') {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                     toggleOpen(true);
                     setDialogValue({ ...emptyAuthor, name: newValue, });
                  });
               }
               else if (newValue && newValue?.name.startsWith('Add ') ) {
                  toggleOpen(true);
                  setDialogValue({
                     ...emptyAuthor,
                     name: newValue.id,
                     id: randomUUID(),
                  });
               }
               else
               {
                  setUseAuthor(newValue);
                  if ( setAuthor ) { setAuthor(newValue); }
               }
            }}
            filterOptions={(options, params) => {
               const filtered = filter(options, params);
               if (params.inputValue !== '') {
                  filtered.push({
                     ...emptyAuthor,
                     id: params.inputValue,
                     name: `Add "${params.inputValue}"`,
                  });
               }
               return filtered;
            }}
            options={authorList.items}
            getOptionLabel={(option) => {
               // e.g value selected with enter, right from the input
               if (typeof option === 'string') { return option; }
               return printGyet(option);
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            sx={{ width: 300 }}
            renderOption={(props, option) => <li {...props}>{printGyet(option)}</li>}
            renderInput={(params) => {
               return (<Tooltip title={tooltip} placement='top'>
                         <TextField {...params} name={name} label={label} required />
                       </Tooltip>)
            }}
            freeSolo
         />
         <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
               <DialogContent>
                 <AuthorForm author={dialogValue} isNew setAuthor={setDialogValue} />
               </DialogContent>
               <DialogActions>
                  <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                  <Button type="submit" variant='contained'>Add</Button>
               </DialogActions>
            </form>
         </Dialog>
      </>
   );
}

export default AuthorInput;
