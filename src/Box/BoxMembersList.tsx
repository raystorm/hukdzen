import React, { useEffect, useState } from 'react';
import { useDispatch, } from 'react-redux';
import { v4 as randomUUID } from 'uuid';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridColumns,
  GridRowId, GridRowParams,
  GridRowModel, GridRowModesModel, GridRowModes,
  GridRowsProp,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRenderEditCellParams, GridRenderCellParams,
} from '@mui/x-data-grid';
import { Autocomplete, TextField, Typography } from '@mui/material';

import { useAppSelector } from '../app/hooks';
import { User, emptyUser } from '../User/userType';
import { printGyet } from "../Gyet/GyetType";
import { userListActions } from '../User/UserList/userListSlice';
import { theme } from '../components/shared/theme';


export type BoxMembersListProps = {
  members:  (User | null)[],
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) 
{
  const { setRows, setRowModesModel } = props;

  const handleClick = () => 
  {
    const id = randomUUID();
    setRows((oldRows) =>
            [...oldRows, { id, user: emptyUser, isNew: true }]);
    setRowModesModel((oldModel) => (
      { ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }, }
    ));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const buildMemberRows = (members: (User | null)[]) =>
{
  let memberRows: GridRowsProp;
  if ( members && 0 < members.length )
  { memberRows = members.map(m => ( { id: m!.id, user: m, } )); }
  else 
  { memberRows = [{ id: '', user: { id: '', name: 'No Members List Loaded' } }]; }
  return memberRows;
}

const BoxMembersList = (props: BoxMembersListProps) =>
{
  const dispatch = useDispatch();

  const [members, setMembers] = useState(props.members);

  useEffect(() => { setMembers(props.members); }, [props.members]);

  const usersList = useAppSelector(state => state.userList);

  //load users list on page load
  useEffect(() => {
    if ( !usersList.items || 0 < usersList.items.length )
    { dispatch(userListActions.getAllUsers(undefined)); }
  }, []);

  const [rows, setRows] = useState(buildMemberRows(members));

  useEffect(() =>{ setRows(buildMemberRows(members)) }, [members]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStart = (params: GridRowParams,
                              event: MuiEvent<React.SyntheticEvent>,) => 
  { event.defaultMuiPrevented = true; };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => 
  { event.defaultMuiPrevented = true; };

  const handleEditClick = (id: GridRowId) => () => 
  { setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } }); };

  const handleSaveClick = (id: GridRowId) => () => 
  {
    if (rowModesModel.user) //only when user has data
    { setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }); }
  };

  const handleDeleteClick = (id: GridRowId) => () => 
  {
    setRows(rows.filter((row) => row.id !== id));
    //TODO: dispatch a remove
  };

  const handleCancelClick = (id: GridRowId) => () => 
  {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) { setRows(rows.filter((row) => row.id !== id)); }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    //TODO: validate not a Duplicate, then dispatch an update
    //https://mui.com/x/react-data-grid/editing/#persistence
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;    
  };

  const colDefs: GridColumns = [
  { field: 'id' },
  {
    field: 'user', headerName: 'Member',
    description: 'User who is a member ',
    editable: true,
    flex: 2,
    renderCell: (params: GridRenderCellParams) => 
    { return <Typography>{printGyet(params.value)}</Typography> },
    //set the column up as an AutoComplete
    renderEditCell: (params: GridRenderEditCellParams) =>
    {
      return (
        <Autocomplete sx={{width: '100%'}}
             value={params.value} options={usersList.items}
             onChange={(e, v) => {
               if ( v && members ) { setMembers([...members, v]); }
               else if ( v ) { setMembers(v); }
             }}
             getOptionLabel={user => printGyet(user)}
             /*
             isOptionEqualToValue={(a, b) => {
              console.log(`xdgac: ${JSON.stringify(b)} && ${JSON.stringify(a)}`)
              //return a === printGyet(b);
              return a.id === b.id
             }}
             */
             isOptionEqualToValue={(a, b) => a.id === b.id}             
             renderInput={(InputParams) =>
                <TextField {...InputParams} required label="Owner"
                     error={!!params.error} helperText={params.error}
                />
             }
        />
      );
    }
  },
  {
    field: 'actions', headerName: 'Actions', type: 'actions',
    cellClassName: 'actions', width: 100,
    getActions: ({ id }) => 
    {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) 
      {
        return [
          <GridActionsCellItem color='success'
            icon={<SaveIcon />} label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem label="Cancel"
            sx={{ color: theme.palette.secondary.main }}
            icon={<CancelIcon />}
            className="textPrimary" color="inherit"
            onClick={handleCancelClick(id)}
          />,
        ];
      }

      return [
        <GridActionsCellItem 
          icon={<EditIcon htmlColor={theme.palette.info.dark} />}
          label="Edit" className="textPrimary"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem icon={<DeleteIcon />}
          sx={{ color: theme.palette.secondary.main }}
          label="Delete" color="inherit"
          onClick={handleDeleteClick(id)}
        />,
      ];
    },
  },
];

  return (
      <DataGrid autoHeight
        editMode="row" rowModesModel={rowModesModel}
        rows={rows} columns={colDefs}
        columnVisibilityModel={{id: false }}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{ Toolbar: EditToolbar, }}
        componentsProps={{ toolbar: { setRows, setRowModesModel }, }}
        experimentalFeatures={{ newEditingApi: true }}
      />
  );
}


export default BoxMembersList;