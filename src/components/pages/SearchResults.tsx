import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch }   from 'react-redux';
import { useLocation, useNavigate }   from 'react-router-dom';

import Typography     from '@mui/material/Typography';
import TextField      from '@mui/material/TextField';
import MenuItem       from '@mui/material/MenuItem';
import InputBase      from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon     from '@mui/icons-material/Search';

import ReduxStore              from '../../app/store';
import { ReduxState }          from '../../app/reducers';
import DocumentDetailsForm     from '../forms/DocumentDetails';
import { DocumentDetailsFieldDefintion } from '../../types/fieldDefitions';
import { DocumentDetails }     from '../../documents/DocumentTypes';
import { documentListActions } from '../../documents/documentList/documentListSlice';
import DocumentsTable          from '../widgets/DocumentsTable';
import { pageMap }             from '../shared/AppBar';
import { theme }               from '../shared/theme';


const searchFields = [
  {
    name: DocumentDetailsFieldDefintion.id.name,
    label: DocumentDetailsFieldDefintion.id.label,
  },
  {
    name: DocumentDetailsFieldDefintion.title.name,
    label: DocumentDetailsFieldDefintion.title.label,
  },
  {
    name: DocumentDetailsFieldDefintion.description.name,
    label: DocumentDetailsFieldDefintion.description.label,
  },
  {
    name: DocumentDetailsFieldDefintion.ownerId.name,
    label: DocumentDetailsFieldDefintion.ownerId.label,
  },
  {
    name: DocumentDetailsFieldDefintion.authorId.name,
    label: DocumentDetailsFieldDefintion.authorId.label,
  },
  {
    name: DocumentDetailsFieldDefintion.type.name,
    label: DocumentDetailsFieldDefintion.type.label,
  },
  {
    name: DocumentDetailsFieldDefintion.version.name,
    label: DocumentDetailsFieldDefintion.version.label,
  },
  {
    name: DocumentDetailsFieldDefintion.bc.title.name,
    label: DocumentDetailsFieldDefintion.bc.title.label,
  },
  {
    name: DocumentDetailsFieldDefintion.bc.description.name,
    label: DocumentDetailsFieldDefintion.bc.description.label,
  },
  {
    name: DocumentDetailsFieldDefintion.ak.title.name,
    label: DocumentDetailsFieldDefintion.ak.title.label,
  },
  {
    name: DocumentDetailsFieldDefintion.ak.description.name,
    label: DocumentDetailsFieldDefintion.ak.description.label,
  },
]

export default function SearchResults()
{
  const navigate = useNavigate();
  //TODO: Logic to generate and pass in Document details
    
   const docDeets = useSelector<ReduxState, DocumentDetails>
                                (state => state.document);

   const[itemId, setItemId] = useState(docDeets.id);

   let itemUrl = `/item/${itemId}`;
   useEffect(() => {
       setItemId(docDeets.id)
       itemUrl = `/item/${docDeets.id}`;
   }, [docDeets]);
   
   const urlSearchParams = new URLSearchParams(useLocation().search);
   const initialKeywords = urlSearchParams.get("q");
   //TODO: get sortBy, Direction, and pagination details

   //search string/terms
   const [keywords, setKeywords] = useState(initialKeywords);
   //sort results
   const [sortBy, setSortBy] = useState(""); //TODO: set defaults here
   const [sortDirection, setSortDirection] = useState("ASC");
   //pagination
   const [start, setStart] = useState(0);
   const [count, setCount] = useState(25); //TODO: adjust default length

   const performSearch = () => 
   {
      //load search page w/ params
      const encodedKw = encodeURIComponent(keywords ? keywords : "");
      const searchPage = `${pageMap[pageMap.length - 1].address}?q=${encodedKw}`;
      console.log(`Enter detected, redirecting to search page. ${searchPage}`);
      navigate(searchPage);
   }
   
   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => 
   {
      //check for enter
      const isEnterKey = 'Enter' === e.key || 'Enter' === e.code 
                      || 'NumpadEnter' === e.code 
                      || 13 === e.which || 13 === e.keyCode;
      if (isEnterKey) 
      {
        console.log("Enter detected, performing search.");
        performSearch();
      }
      else { console.log(`Keydown Not Enter: ${e.key}`); }
    };

    const handleSearchFieldChange = (kw: string) => { setKeywords(kw); };
      
    //Perform the search
    let docList = useSelector<ReduxState, DocumentDetails[]>
                           (state => state.documentList);
    useEffect(() => { 
       ReduxStore.dispatch(documentListActions.searchForDocuments(keywords)); 
       console.log('Performing Search on Page Load.');
    }, [keywords]);

   return (
        <div>
          <div>
            <h2>Advanced Search</h2>
            <TextField name="Field" label="Field" select
                       helperText="Select Field to search" >
                 <MenuItem key="keywords" value="keywords">Keywords</MenuItem>
                 { 
                    searchFields.map(({name, label}) => 
                      <MenuItem key={name} value={name}>{label}</MenuItem>
                    )
                 }
            </TextField>
            {/* replace w/ padding margin or something */}
            &nbsp;&nbsp;&nbsp;&nbsp; 
            <TextField placeholder="What are you looking for?"
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
                <DocumentsTable title='Search Results' documents={docList} />
              </div>
              {/* TODO: float right */}
              <div>
                <p>Detail Properties for Selected Document</p>
                <p>link to go to full document properties</p>
                <p>download a copy</p>
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