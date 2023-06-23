import React, { useEffect, useState } from 'react';
import { useDispatch }   from 'react-redux';
import { useLocation, useNavigate }   from 'react-router-dom';

import Typography     from '@mui/material/Typography';
import TextField      from '@mui/material/TextField';
import MenuItem       from '@mui/material/MenuItem';
import InputBase      from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon     from '@mui/icons-material/Search';

import { useAppSelector } from "../../app/hooks";
import DocumentDetailsForm     from '../forms/DocumentDetails';
import { DocumentDetailsFieldDefinition } from '../../types/fieldDefitions';
import { DocumentDetails }     from '../../docs/DocumentTypes';
import { documentListActions } from '../../docs/docList/documentListSlice';
import DocumentsTable          from '../widgets/DocumentsTable';
import { pageMap }             from '../shared/ResponsiveAppBar';
import { theme }               from '../shared/theme';
import {DASHBOARD_PATH, SEARCH_PATH} from "../shared/constants";


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


const SearchResults = () =>
{
   const location = useLocation();
   const skipRender = (): boolean => SEARCH_PATH !== location.pathname;

   const dispatch = useDispatch();
   const navigate = useNavigate();
  //TODO: Logic to generate and pass in Document details
    
   const docDeets = useAppSelector(state => state.document);

   const[itemId, setItemId] = useState(docDeets.id);

   let itemUrl = `/item/${itemId}`;
   useEffect(() => {
       if ( skipRender() ) { return; }
       setItemId(docDeets.id);
       itemUrl = `/item/${docDeets.id}`;
   }, [docDeets]);
   
   const urlSearchParams = new URLSearchParams(useLocation().search);
   const initialKeywords = urlSearchParams.get("q");
   //TODO: get sortBy, Direction, and pagination details

   //search string/terms
   const [keywords, setKeywords] = useState(initialKeywords);
   const [field,    setField]    = useState('');

   //sort results
   const [sortBy,        setSortBy] = useState(""); //TODO: set defaults here
   const [sortDirection, setSortDirection] = useState("ASC");
   //pagination
   const [start, setStart] = useState(0);
   const [count, setCount] = useState(25); //TODO: adjust default length

   const performSearch = () => 
   {
      //load search page w/ params
      const addr = pageMap[pageMap.length - 1].path;
      let searchPage;
      if ( keywords )
      {
        dispatch(documentListActions.searchForDocuments({
                 keyword: keywords, field: field, }));
      }
   }
   
   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => 
   {
      //check for enter
      const isEnterKey = 'Enter' === e.key || 'Enter' === e.code 
                      || 'NumpadEnter' === e.code 
                      || 13 === e.which || 13 === e.keyCode;
      if (isEnterKey) 
      {
        // console.debug("Enter detected, performing search.");
        performSearch();
      }
      // else { console.debug(`Keydown Not Enter: ${e.key}`); }
    };

    const handleSearchFieldChange = (kw: string) => { setKeywords(kw); };
      
    //Perform the search
    let docList = useAppSelector(state => state.documentList);

    useEffect(() => {
       if ( skipRender() ) { return; }
       //TODO: keyword parsing
       dispatch(documentListActions.searchForDocuments({
          field:   field,
          keyword: keywords ?? '',
       }));
       console.log(`Performing Search for: ${JSON.stringify(keywords)}`);
    },[]);  // [keywords, field]);

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
                                 //TODO: make this a button, to search with an onClick
                                 <InputAdornment position="start">
                                   <SearchIcon className="headerSearchIcon"
                                               sx={{ color: theme.palette.secondary.main }}
                                               onClick={performSearch}
                                   />
                                 </InputAdornment>
                            ),
                       }}
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
                                    editable={false} {...docDeets} />
              </div>
            </div>
        </div>
   );
}

export default SearchResults;