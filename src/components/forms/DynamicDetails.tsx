import React, { Component, ReactComponentElement } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';
import { DocumentDetails, LangFields } from '../../docs/DocumentTypes';
import { FieldDefinition } from '../../types/fieldDefitions';
import { TextField, TextFieldProps, Tooltip, Typography } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { DateTimePicker } from '@mui/x-date-pickers';

// Extra should come in for the form
interface DetailProps /*extends DocumentDetails */  {
   pageTitle: string;
   editable?: boolean;
};

const DynamicDetailsForm: React.FC<DetailProps> = (detailProps) =>
{
  const { pageTitle, editable = false, ...details } = detailProps;

  const detail: { [key:string]: any } = details;

  const hidden = (name: string, label: string, value: string) => {
    return <TextField name={name} value={value} label={label} type='hidden' 
                      style={{display:'none'}} />
  }
  
  const input = (name: string, label: string, value: any, title?: string) => {
    return (
      <Tooltip title={title}>
           <TextField name={name} value={value} label={label} />
      </Tooltip>);
  }

  const textarea = (name: string, label: string, value: any, title?:string) => {
    return (
      <Tooltip title={title}>
           <TextField name={name} label={label} value={value}
                      multiline minRows='10' />
      </Tooltip>);
  }

  const displayLangFields = (fields: FieldDefinition) =>
  {
    return (<> {
    Object.entries(fields).map(([key, docField]) =>
    {
      switch(key)
      {
        case 'description':          
        return textarea(docField.name, docField.label, docField.value,
                        docField.description);
        case 'title':
          default:
            return input(docField.name, docField.label, docField.value,
                         docField.description);
          }
    })
    }</>)
  }

  return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
        {
          /* TODO: 
           *   flesh out form props
           *   Improve Form layout   
           *   Embedd Document/image
           * 
           *   Skip FilePath in form (make a link instead.)
           */
        }
        <form contentEditable={editable} >
          {
             Object.keys(detail).map((key) => 
             {
                switch(key)
                {
                  case 'id':
                    return hidden(key, key, detail[key]);
                  case 'filePath':
                    return (
                      <Typography component='a' href={detail[key]}>
                          Download File
                      </Typography>);
                  case 'description':
                    return textarea(key, key, detail[key]);
                  case 'bc':
                  case 'ak':
                    return displayLangFields(detail[key]);
                  case 'created':
                  case 'updated': 
                    return(
                      <div style={{display: 'inline-block', margin: '10px'}} >
                        <DateTimePicker label={key} value={detail[key]} 
                           renderInput={(tfProps) => <TextField {...tfProps} />} 
                           onChange={() => {}}
                        />
                      </div>);
                      /* onChange={(newValue) => {setValue(newValue);}} */
                  default:
                    return input(key, key, detail[key]);
                }
             })
          }
        </form>
      </div>
    );
};

export default DynamicDetailsForm;
