import { connect } from 'react-redux'
import React, { Component, ReactComponentElement } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';

interface DocTableProps {
    title: string;
    documents?: []; //TODO: Documents Type
};

const Documents: React.FC<DocTableProps> = (docTableProps) =>
{
  const { title } = docTableProps;  

  
  return (      
        <div>
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Nahawt(BC)</th>
              <th>Nahawt(AK)</th>
              <th>author</th>
            </tr>
          </thead>
          <tbody>
            {/*
              * TODO:
              *   + fill in based on passed in Documents array 
              *   + add pagination
              *   + add sorting
              *   + add filtering
              *   * look into a pre-built table component
              */}            
            <tr>
              Soluta, voluptate.
              <td>Lorem ipsum</td>
              <td>dolor sit amet</td>
              <td>consectetur,</td>
              <td>adipisicing elit.</td>
            </tr>
            <tr>
              <td>Doloribus</td>
              <td>nostrum</td>
              <td>iusto possimus</td>
              <td>quas totam,</td>
            </tr>
            <tr>
              <td>sed mollitia,</td>
              <td>cumque nisi voluptate explicabo</td>
              <td>quis et velit in quae officiis,</td>
              <td>quibusdam enim?</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
};

export default Documents;