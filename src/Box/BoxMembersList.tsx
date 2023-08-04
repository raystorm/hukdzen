import React, { useEffect, useState } from 'react';
import { useDispatch, } from 'react-redux';
import { v4 as randomUUID } from 'uuid';

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
  GridRenderEditCellParams, GridRenderCellParams, useGridApiContext, ValueOptions, GridValueFormatterParams,
} from '@mui/x-data-grid';
import {Autocomplete, MenuItem, TextField, Typography} from '@mui/material';

import { useAppSelector } from '../app/hooks';
import { User, emptyUser } from '../User/userType';
import { printGyet } from "../Gyet/GyetType";
import { userListActions } from '../User/UserList/userListSlice';
import { theme } from '../components/shared/theme';
import {printRole, Role, rolesList, rolesSingleList} from "../Role/roleTypes";
import {BoxUser, buildBoxUser, emptyBoxUser} from "../BoxUser/BoxUserType";
import {BoxUserList, emptyBoxUserList} from "../BoxUser/BoxUserList/BoxUserListType";
import {Xbiis} from "./boxTypes";
import {boxUserActions} from "../BoxUser/BoxUserSlice";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildInfoAlert} from "../AlertBar/AlertBarTypes";
import {ModelBoxUserConnection} from "../types/AmplifyTypes";


interface MemberRow extends BoxUser {
  isNew?: boolean
}

export interface MemberRowList extends ModelBoxUserConnection {
  items:  Array<MemberRow | null >,
}

export type BoxMembersListProps = {
  box: Xbiis,
  membersList?:  MemberRowList,
  disableVirtualization?: boolean,
}

interface EditToolbarProps {
  setMembers: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

const BoxMembersList = (props: BoxMembersListProps) =>
{
  const { box, membersList, disableVirtualization = false } = props;

  const dispatch = useDispatch();

  const [members, setMembers] = useState(membersList?.items);
  console.log(`Members to Display(List): ${JSON.stringify(membersList, null, 2)}`);
  console.log(`Members to Display(Members): ${JSON.stringify(members, null, 2)}`);

  useEffect(() => { setMembers(membersList?.items); }, [membersList]);

  const usersList = useAppSelector(state => state.userList);

  //load users list on page load
  useEffect(() => {
    if ( !usersList.items || 0 == usersList.items.length )
    { dispatch(userListActions.getAllUsers()); }
  }, []);

  const displayUsersList = () : ValueOptions[]  =>
  { return usersList.items.map(u =>
      { return { value: JSON.stringify(u), label: printGyet(u) } as ValueOptions; }
    )
  };

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const EditToolbar = (props: EditToolbarProps) =>
  {
    const { setMembers, setRowModesModel, } = props;

    const handleAddClick = () =>
    {
      const id = randomUUID();
      setMembers((oldRows) =>
         [...oldRows, { id, user: emptyUser, box: box, role: box.defaultRole, isNew: true }]);
      setRowModesModel((oldModel) => (
         { ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'user' }, }
      ));
    };

    return (
       <GridToolbarContainer>
         <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
           Add record
         </Button>
       </GridToolbarContainer>
    );
  }

  const handleRowEditStart = (params: GridRowParams,
                              event: MuiEvent<React.SyntheticEvent>,) => 
  { event.defaultMuiPrevented = true; };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => 
  { event.defaultMuiPrevented = true; };

  const handleEditClick = (id: GridRowId) => () => 
  { setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } }); };

  const handleSaveClick = (params: GridRowParams) => () =>
  {
    const { id, row, } = params;
    //if (rowModesModel.user) //only when user has data
    //{
      //console.log(`saving: ${JSON.stringify(params)}`);
      console.log(`saving row: ${JSON.stringify(params.row)}`);
      // console.log(`saving row user: ${JSON.stringify(params.row.user)}`);
      // console.log(`saving row role: ${JSON.stringify(params.row.role)}`);

      //ensure type is correctly built.
      const boxUser: BoxUser = {
        __typename: "BoxUser",
        id: row.id,
        user: row.user,
        boxUserUserId: row.user.id,
        box: box,
        boxUserBoxId: box.id,
        role: row.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if ( row.isNew ) { dispatch(boxUserActions.createBoxUser(boxUser)); }
      else { dispatch(boxUserActions.updateBoxUser(boxUser)); }

      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    //}
  };

  const handleDeleteClick = (id: GridRowId) => () => 
  {
    dispatch(boxUserActions.removeBoxUserById(id.toString()));
    //setRows(rows.filter((row) => row.id !== id));
    setMembers(members?.filter((row) => row?.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => 
  {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    //const editedRow = rows.find((row) => row.id === id);
    //if (editedRow!.isNew) { setRows(rows.filter((row) => row.id !== id)); }
    const editedRow = members?.find((row) => row?.id === id);
    if (editedRow!.isNew)
    { setMembers(members?.filter((row) => row?.id !== id)); }
  };

  const processRowUpdate = (newRow: GridRowModel<MemberRow>) => {
    console.log(`processing Update for: ${JSON.stringify(newRow)}`);
    const updatedRow: MemberRow = { ...newRow, isNew: false };
    //TODO: validate not a Duplicate, then dispatch an update
    //https://mui.com/x/react-data-grid/editing/#persistence
    setMembers(members?.map((row) => (row?.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const colDefs: GridColumns = [
  { field: 'id', flex: 0.1 },
  {
    field: 'user', headerName: 'Member',
    description: 'User who is a member ',
    editable: true,
    flex: 2,
    type: 'singleSelect',
    valueFormatter: (params: GridValueFormatterParams) =>
    {
      const skip = (key, value) => {
        if ( key =='api' ) { return undefined; }
        return value;
      };
      console.log(`Formatting value for: ${JSON.stringify(params, skip,2)}`);
      return printGyet(JSON.parse(params.value));
    },
    /* */
    valueGetter: (params) => //{ return JSON.stringify(params.row.user) },
    {
      //console.log(`getting value: ${params.value}`);
      const retVal = params.row.user;
      console.trace(`getting value: ${JSON.stringify(retVal, null, 2)}`);
      //if ( typeof params.value === 'string' || params.value instanceof String)
      //{ return params.row; }
      return JSON.stringify(retVal);
    },
    // */
    valueSetter: (params) =>
    {
      //console.log(`value to set: ${JSON.stringify(params.value)}`);
      //console.log(`value to set: ${params.value}`);
      const selectedUser = JSON.parse(params.value);
      //const selectedUser = params.value;

      if ( params.row?.user?.id === selectedUser.id ) { return params.row; }

      params.row.user = selectedUser;
      //console.log(`setting: ${JSON.stringify(params)}`);
      const row = { ...params.row, user: selectedUser}
      if ( !row.id ) { row.id = randomUUID(); }

      console.log(`setting: ${JSON.stringify(row)}`);
      console.log(`original Members: ${JSON.stringify(members)}`);

      //need to update the state for save to find it.
      if ( members )
      {
        let newMembers: typeof members;
        const index = members.findIndex(r => r?.id === row.id);
        if ( -1 < index )
        {
          newMembers = [...members];
          newMembers[index] = { ...row };
          //members[index] = { ...row };
          //newMembers[index]!.id   = row.id;
          //newMembers[index]!.user = row.user;
          //newMembers[index]!.role = row.role;
          console.log(`updated Members[${index}] to be: ${JSON.stringify(newMembers[index])}`);
          setMembers(newMembers);
          //setMembers(members.with(index, row));
        }
        //else
        // {
        //    members.push(row);
        //    setMembers(members);
        // }
      }
      return row; //function contract, return updated row
    },
    valueOptions: displayUsersList(),

    // renderCell: (params: GridRenderCellParams) =>
    // {
    //   console.log(`rendering value: ${JSON.stringify(params.value)}`);
    //   console.log(`rendering formattedValue: ${JSON.stringify(params.formattedValue)}`);
    //   console.log(`rendering row: ${JSON.stringify(params.row)}`);
    //   console.log(`rendering id: ${JSON.stringify(params.id)}`);
    //   console.log(`rendering field: ${JSON.stringify(params.field)}`);
    //   return <Typography>{printGyet(params.value)}</Typography>
    // },

    // TODO: autocomplete
    // //set the column up as an AutoComplete
    // renderEditCell: (params: GridRenderEditCellParams) =>
    // {
    //   return (
    //     <Autocomplete sx={{width: '100%'}}
    //          value={params.value} options={usersList.items}
    //          onChange={(e, v) => {
    //            // const boxUser = buildBoxUser(v, buildBoxRole(box, params.row.role));
    //            // if ( v && members?.items )
    //            // {
    //            //   const id = params.row.id
    //            //   //find the row with the ID, if not found add
    //            //
    //            //   const index = members.items.findIndex(m => m?.id === params.row.id)
    //            //   if ( -1 < index ) { members.items[index] = boxUser }
    //            //   else { members.items.push(boxUser); }
    //            //   setMembers(members);
    //            // }
    //            // else if ( v )
    //            // {
    //            //   setMembers({
    //            //     ...emptyBoxUserList,
    //            //     items: [boxUser],
    //            //   });
    //            // }
    //            const newRow = { ...params.row, user: v };
    //            if ( v && rows && 0 < rows.length )
    //            {
    //              const id = params.row.id
    //              //find the row with the ID, if not found add
    //
    //              const index = rows.findIndex(r => r?.id === params.row.id)
    //              if ( -1 < index )
    //              {
    //                const newRows = [...rows];
    //                newRows[index] = newRow;
    //                setRows(newRows);
    //              }
    //              else { setRows([...rows, newRow]) }
    //            }
    //            else { setRows([newRow]) }
    //          }}
    //          getOptionLabel={user => printGyet(user)}
    //          /*
    //          isOptionEqualToValue={(a, b) => {
    //           console.log(`xdgac: ${JSON.stringify(b)} && ${JSON.stringify(a)}`)
    //           //return a === printGyet(b);
    //           return a.id === b.id
    //          }}
    //          */
    //          isOptionEqualToValue={(a, b) => a.id === b.id}
    //          renderInput={(InputParams) =>
    //             <TextField {...InputParams} required label="Member"
    //                  error={!!params.error} helperText={params.error}
    //             />
    //          }
    //     />
    //   );
    // }
  },
  {
     field: 'role', headerName: 'Role',
     description: 'Level of Access to items in the box.',
     editable: true, flex: 1,
     type: 'singleSelect',
     //valueSetter: (params) => {
     // console.log(`setting Role: ${JSON.stringify(params.row)}`);
     // return params.row;
     //},
     valueOptions: rolesList as ValueOptions[],
     //valueOptions: ['None', 'READ', 'WRITE'],
     /*
     renderCell: (params: GridRenderCellParams) =>
     { return <Typography>{printRole(params.value.role)}</Typography> },
     renderEditCell: (params: GridRenderEditCellParams) =>
     {
       return ( <TextField sx={{width: '100%'}} select
                           value={params.value}
                           onChange={e => {
                             e.target.value
                           }}
                >
                  { rolesList.map((c) => (
                     <MenuItem key={c.value} value={c.value}>
                       {c.label}
                     </MenuItem>
                  ))}
                </TextField>
              );
     }
     */
  },
  {
    field: 'actions', headerName: 'Actions', type: 'actions',
    cellClassName: 'actions', width: 100,
    getActions: (params: GridRowParams<MemberRow>) =>
    {
      const { id } = params;
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      //useGridApiContext().current.getRow(params.id);

      if (isInEditMode) 
      {
        return [
          <GridActionsCellItem color='success'
            icon={<SaveIcon />} label="Save"
            onClick={handleSaveClick(params)}
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

  const skipBox = (key, val) => {
    if ( key == 'box' ) { return undefined; }
    return val;
  }
  console.log(`Rows for ${JSON.stringify(members, skipBox,2)}`);

  return (
      <DataGrid autoHeight
        editMode="row" rowModesModel={rowModesModel}
        rows={members!} columns={colDefs}
        //columnVisibilityModel={{id: false }}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        //processRowUpdate={processRowUpdate}
        components={{ Toolbar: EditToolbar, }}
        componentsProps={{ toolbar: { setMembers, setRowModesModel }, }}
        experimentalFeatures={{ newEditingApi: true }}
        disableVirtualization={disableVirtualization}
      />
  );
}


export default BoxMembersList;