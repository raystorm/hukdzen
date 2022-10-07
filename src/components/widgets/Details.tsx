import { connect } from 'react-redux'
import React, { Component, ReactComponentElement } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';
import { DocumentDetails } from '../../types'
import { TextField } from '@mui/material';

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
                Object.keys(detail).map(key => {
                  return <TextField name={key} value={detail[key]} 
                                    label={key} 
                                    style={{padding:'7px'}}/>
                })
            }
        </form>
      </div>
    );
};

export default Document;