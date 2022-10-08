import { connect } from 'react-redux'
import React, { Component, ReactComponentElement } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';
import { DocumentDetails } from '../../types'
import { TextField, TextFieldProps, Typography } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { DateTimePicker } from '@mui/x-date-pickers';


interface DetailProps extends DocumentDetails {
   pageTitle: string;
   editable?: boolean;
};

const Document: React.FC<DetailProps> = (detailProps) =>
{
  const { pageTitle, editable = false, ...details } = detailProps;

  const detail: { [key:string]: any } = details;

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
             Object.keys(detail).map(key => 
             {
                let tfProps: TextFieldProps = { style: { margin: '10px;' } };

                switch(key)
                {
                  case 'id':
                    return <TextField name={key} value={detail[key]}                                     
                                      label={key}  type='hidden'
                                      style={{display: 'none', margin: '10px'}} />
                  case 'filePath':
                    return (
                      <Typography component='a' href={detail[key]}
                                    style={{margin: '10px;'}}>
                          Download File
                      </Typography>);
                  case 'description':
                  case 'magonBC':
                  case 'magonAK':
                      return <TextField name={key} value={detail[key]}                                     
                                        label={key} multiline
                                        minRows='10'
                                        style={{margin: '10px'}} />
                  case 'created':
                  case 'updated':
                    return (
		      <div style={{display: 'inline-block', margin: '10px'}} >
                      <DateTimePicker
                           renderInput={(tfProps) => <TextField {...tfProps} />} 
                           label={key} value={detail[key]} onChange={() => {}}
                      />
                      </div>
                      /* onChange={(newValue) => {setValue(newValue);}} */
                    )
                  default:
                    return <TextField name={key} value={detail[key]}
                                      label={key} 
                                      style={{margin: '10px'}} />
                }
             })
          }
        </form>
      </div>
    );
};

export default Document;
