import React, { useEffect, useState } from 'react';
import { useDispatch }   from 'react-redux';
import {matchPath, useLocation} from 'react-router-dom';

import Typography     from '@mui/material/Typography';
import TextField      from '@mui/material/TextField';
import MenuItem       from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon     from '@mui/icons-material/Search';

import { useAppSelector } from "../../app/hooks";
import DocumentDetailsForm     from '../forms/DocumentDetails';
import { DocumentDetailsFieldDefinition } from '../../types/fieldDefitions';
import { documentListActions } from '../../docs/docList/documentListSlice';
import DocumentsTable          from '../widgets/DocumentsTable';
import { theme }               from '../shared/theme';
import {SEARCH_PATH} from "../shared/constants";


export const searchFields = [
  {
    name: DocumentDetailsFieldDefinition.id.name,
    label: DocumentDetailsFieldDefinition.id.label,
  },
  {
    name: DocumentDetailsFieldDefinition.eng_title.name,
    label: DocumentDetailsFieldDefinition.eng_title.label,
  },
  {
    name: DocumentDetailsFieldDefinition.eng_description.name,
    label: DocumentDetailsFieldDefinition.eng_description.label,
  },
  {
    name: DocumentDetailsFieldDefinition.docOwner.name,
    label: DocumentDetailsFieldDefinition.docOwner.label,
  },
  {
    name: DocumentDetailsFieldDefinition.author.name,
    label: DocumentDetailsFieldDefinition.author.label,
  },
  {
    name: DocumentDetailsFieldDefinition.type.name,
    label: DocumentDetailsFieldDefinition.type.label,
  },
  {
    name: DocumentDetailsFieldDefinition.version.name,
    label: DocumentDetailsFieldDefinition.version.label,
  },
  {
    name: DocumentDetailsFieldDefinition.bc_title.name,
    label: DocumentDetailsFieldDefinition.bc_title.label,
  },
  {
    name: DocumentDetailsFieldDefinition.bc_description.name,
    label: DocumentDetailsFieldDefinition.bc_description.label,
  },
  {
    name: DocumentDetailsFieldDefinition.ak_title.name,
    label: DocumentDetailsFieldDefinition.ak_title.label,
  },
  {
    name: DocumentDetailsFieldDefinition.ak_description.name,
    label: DocumentDetailsFieldDefinition.ak_description.label,
  },
];

//TODO: localize these fields

export const searchTitle = 'G̱a̱ni Gügüül (Advanced Search)';

// kumpshewamps = "What are you looking for?"
export const searchPlaceholder = 'Gooyu Gügüültn';

export const searchResultsTableTitle = 'Gügüül Goo (Search Results)';

export const isEnterKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
   return ( 'Enter' === e.key || 'Enter' === e.code || 'NumpadEnter' === e.code
         || 13 === e.which || 13 === e.keyCode );
}

const SearchResults = () =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(SEARCH_PATH, location.pathname);

   const dispatch = useDispatch();
    
   const docDeets = useAppSelector(state => state.document);

   const[itemId, setItemId] = useState(docDeets.id);

   let itemUrl = `/item/${itemId}`;
   useEffect(() => {
       if ( skipRender() ) { return; }
       setItemId(docDeets.id);
       itemUrl = `/item/${docDeets.id}`;
   }, [docDeets]);
   
   const urlSearchParams = new URLSearchParams(location.search);
   const initialKeywords = urlSearchParams.get("q");
   //TODO: get sortBy, Direction, and pagination details

   //search string/terms
   const [keywords, setKeywords] = useState(initialKeywords);
   const [field,    setField]    = useState('');

   //sort results
   const [sortBy,        setSortBy] = useState("created");
   const [sortDirection, setSortDirection] = useState("ASC");
   //pagination
   const [start, setStart] = useState(0);
   const [count, setCount] = useState(25); //TODO: adjust default length

   const performSearch = () => 
   {  //Dispatch the search action to update the page
      if ( keywords )
      {
        dispatch(documentListActions.searchForDocuments({
                 keyword: keywords, field: field, }));
      }
   }
   
   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => 
   {  //check for enter
      if (isEnterKey(e))
      { //trigger function to perform the search
        // console.log("Enter detected, performing search.");
        performSearch();
      }
      // else { console.log(`Keydown Not Enter: ${e.key}`); }
    };

    const handleSearchFieldChange = (kw: string) => { setKeywords(kw); };
      
    //Perform the search
    let docList = useAppSelector(state => state.documentList);

    useEffect(() => {
        if ( skipRender() ) { return; }
        const urlParams = new URLSearchParams(location.search);
        const updatedKeywords = urlParams.get("q");
        setKeywords(updatedKeywords);
        console.log(`updating search keywords: ${updatedKeywords}`);
    }, [location]); //[initialKeywords, urlSearchParams, location.search]);  // [keywords, field]);

    useEffect(() => {
       if ( skipRender() ) { return; }
       //TODO: keyword parsing
       dispatch(documentListActions.searchForDocuments({
          field:   field,
          keyword: keywords ?? '',
       }));
       console.log(`Performing Search for: ${JSON.stringify(keywords)}`);
    }, [keywords, field]); //[initialKeywords, urlSearchParams, location.search]);  // [keywords, field]);

   if ( skipRender() ) { return <></>; }

   return (
        <div>
          <div>
            <h2>{searchTitle}</h2>
            <TextField name="Field" label="Field" select
                       // TODO: localize this
                       helperText="Select Field to search"
                       value={field}
                       onChange={e => { setField(e.target.value) }}>
                 <MenuItem key='' value='' style={{height: '1.2em'}}> </MenuItem>
                 <MenuItem key='keywords' value='keywords'>Keywords</MenuItem>
                 { 
                    searchFields.map(({name, label}) => 
                      <MenuItem key={name} value={name}>{label}</MenuItem>
                    )
                 }
            </TextField>
            {/* replace w/ padding margin or something */}
            &nbsp;&nbsp;&nbsp;&nbsp; 
            <TextField placeholder={searchPlaceholder}
                       onChange={(e) => handleSearchFieldChange(e.target.value)}
                       onKeyDown={(e) => handleSearchKeyDown(e)}
                       InputProps={{
                            id: "AdvSearch",
                            "aria-label": "search",
                            startAdornment: (
                                 <InputAdornment position="start">
                                   <SearchIcon className="headerSearchIcon"
                                               sx={{ color: theme.palette.secondary.main }}
                                               onClick={performSearch}
                                   />
                                 </InputAdornment>
                            ),
                       }}
                       value={keywords}
              />
            </div>
            <hr />
            <div className='twoColumn'>
              <div>
                <DocumentsTable title={searchResultsTableTitle}
                                documents={docList} />
              </div>
              <div>
                <p>
                  <Typography component='a' href={itemUrl}>
                     Full Document Details.
                  </Typography>
                </p>
                <DocumentDetailsForm pageTitle='Selected Document Details'
                                     editable={false} doc={docDeets} />
              </div>
            </div>
        </div>
   );
}

export default SearchResults;