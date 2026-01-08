import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { v4 as randomUUID, v5 as hashUUID } from 'uuid';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridColumns,
         GridRowId, GridRowParams, GridRowsProp,
         GridRowModel, GridRowModesModel, GridRowModes,
         GridToolbarContainer, GridActionsCellItem,
         GridEventListener,
         ValueOptions, GridValueFormatterParams,
         MuiEvent,
} from '@mui/x-data-grid';

import {ModelBoxUserConnection} from "../types/AmplifyTypes";

import { useAppSelector } from '../app/hooks';
import { isDevLocation } from '../utils/location';
import { logger } from '../utils/logger';
import { nullFilter } from '../types';
import { emptyUser } from '../User/userType';
import { printGyet } from "../Gyet/GyetType";
import { userListActions } from '../User/UserList/userListSlice';
import { theme } from '../components/shared/theme';
import { rolesList } from "../Role/roleTypes";
import { BoxUser, emptyBoxUser } from "../BoxUser/BoxUserType";
import {Xbiis} from "./boxTypes";
import {boxUserActions} from "../BoxUser/BoxUserSlice";
import {userList} from "../User/UserList/userListType";

enum RowAction {
   SAVE =   "SAVE",
   CANCEL = "CANCEL",
   DELETE = "DELETE",
   EDIT =   "EDIT",
   ADD =    "ADD",
   NONE =   "NONE",
}

interface MemberRow extends BoxUser {
  isNew?: boolean,
  //action?: RowAction,
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

const buildMemberRow = (item: BoxUser): MemberRow =>
{
   return { ...emptyBoxUser, ...item,
            user: JSON.parse(JSON.stringify(item.user)) } as MemberRow
}

const BoxMembersList = (props: BoxMembersListProps) =>
{
  const { box, membersList, disableVirtualization = false } = props;

  const dispatch = useDispatch();

  const [members, setMembers] = useState(() =>
        membersList?.items
                   ?.filter(nullFilter)
                   ?.map(item => buildMemberRow(item)));


  //if ( isDev() )
  //{
  //  logger.log('Members to Display(List):',    membersList);
  //  logger.log('Members to Display(Members):', members);
  //}

  useEffect(() =>
  {
     setMembers(membersList?.items
                           ?.filter(nullFilter)
                           ?.map(item => buildMemberRow(item)));
  }, [membersList?.items]);

  //const usersList = useAppSelector(state => state.userList);
  // const usersList: userList = useAppSelector(state => ({
  //   ...state.userList,
  //   items: state.userList.items.map(user => user ? { ...user } : user)
  // }));
  // const selectUsersList = useMemo(() =>
  //   (state) => ( {
  //      ...state.userList,
  //      items: state.userList.items.map(user => user ? { ...user } : user)
  //   }),
  // []);
  const selectUsersList = createSelector(
    (state) => state.userList,
    (userList) => ({
       ...userList,
       items: userList.items.map(user => user ? JSON.parse(JSON.stringify(user)) : user)
    })
  );
  const usersList: userList = useAppSelector(selectUsersList);

   //load users list on page load
  useEffect(() => {
    if ( !usersList.items || 0 === usersList.items.length )
    { dispatch(userListActions.getAllUsers()); }
  }, [dispatch]);

  const userOptionList = useMemo(() => {
     const empty =  { value: JSON.stringify(emptyUser), label: '' };
     //const empty =  { value: emptyUser, label: '' };
     return [ empty,
              ...usersList.items.map(u => {
                 return { value: JSON.stringify(u), label: printGyet(u) };
              })
     ]
  }, [ usersList?.items ]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [editRows, setEditRows] = useState<GridRowModel<{[key: string]: MemberRow}>>({});
  //const [rowAction, setRowAction] = useState<RowAction>(RowAction.NONE);
  const [saveRowIds, setSaveRowIds] = useState<string[]>([]);
  //const apiRef = useGridApiRef();
  const editedRowsRef = useRef<{[key: string]: MemberRow}>({});

  const EditToolbar = (props: EditToolbarProps) =>
  {
    const { setMembers, setRowModesModel, } = props;

    const handleAddClick = () =>
    {
      const id = randomUUID();
      //const id = hashUUID(emptyUser.id, box.id);
      setMembers((oldRows) =>
         [...oldRows, { id, user: { ...emptyUser }, box: {...box}, role: box.defaultRole, isNew: true }]);
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
    //const { id, row } = params;
    const { id } = params;
    
    // Get current edited values from DataGrid API
    //const row = apiRef.current.getRowWithUpdatedValues(id, 'user');
    // Get current edited values from ref
    const row = editedRowsRef.current[id as string] || params.row;

    logger.log('handleSaveClick called for row:', row);

    if ( !row || !row.user?.id || emptyUser.id === row.user.id )
    {
       logger.log('handleSaveClick: early return - invalid row');
       return;
    }
    
    setSaveRowIds([...saveRowIds, id as string]);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleSaveDispatch = (row: MemberRow) =>
  {
     logger.log('saving row:', row);

     //ensure type is correctly built.
     const boxUser: BoxUser = {
        __typename: "BoxUser",
        id: row.id,
        //user: row.user,
        user: JSON.parse(JSON.stringify(row.user)),
        boxUserUserId: row.user.id,
        box: box,
        boxUserBoxId: box.id,
        role: row.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
     };

     if ( row.isNew ) { dispatch(boxUserActions.createBoxUser(boxUser)); }
     else { dispatch(boxUserActions.updateBoxUser(boxUser)); }
  }

  const handleDeleteClick = (id: GridRowId) => () => 
  {
    dispatch(boxUserActions.removeBoxUserById(id.toString()));
    setMembers(members?.filter((row) => row?.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => 
  {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = members?.find((row) => row?.id === id as string);
    if (editedRow!.isNew)
    { setMembers(members?.filter((row) => row?.id !== id)); }
  };

  /* */
  const processRowUpdate = (newRow: GridRowModel<MemberRow>) =>
  {
    if ( isDevLocation() )
    {
       logger.log('received Update for:', newRow);
       logger.log('editedRowsRef keys:',  Object.keys(editedRowsRef.current));
       logger.log('looking for ID:',      newRow.id);
       logger.log('found in ref:',        editedRowsRef.current[newRow.id as string]);
       logger.log('full Ref:',            editedRowsRef.current);
    }
    //const updatedRow: MemberRow = { ...newRow, isNew: false };
    //const editRow = editedRowsRef.current[newRow.id as string] ?? newRow;
    let editRow: MemberRow | undefined = undefined;

    // Get Row based on matching user ID
    const matchingRowId = Object.keys(editedRowsRef.current)
            .find(rowId => editedRowsRef.current[rowId]?.user?.id === newRow.id);

    if (matchingRowId)
    {
       editRow = editedRowsRef.current[matchingRowId];
       logger.log('Found matching row by user ID:', matchingRowId);
    }

    if (!editRow)
    {
       logger.log('cant find row');
       //throw new Error(`Unexpected error finding Row to update.`);
       return newRow; //duck
    }

    const updatedRow: MemberRow = { ...editRow };
    logger.log('processing Update for:', updatedRow);

     // Check for duplicate user in the same box
     const isDuplicate = members?.some(row =>
       row?.id !== updatedRow.id && row?.user?.id === updatedRow.user?.id
     );

     if (isDuplicate)
     {
        logger.log('Its a dupe!');
        //throw new Error(`User ${printGyet(updatedRow.user)} is already a member of this box`);
        return newRow;
     }

    //https://mui.com/x/react-data-grid/editing/#persistence
    //setMembers(members?.map((row) => (row?.id === updatedRow.id ? updatedRow : row)));

    //check and save row if flagged
    if ( saveRowIds.includes(updatedRow.id as string) )
    {
       handleSaveDispatch(updatedRow);
       setSaveRowIds(saveRowIds.filter(id => id !== updatedRow.id));
    }

    return updatedRow;
  };
  // */

  const processRowUpdateError = (error: Error) => {
    // This catches MUI's internal processRowUpdate errors, not our custom logic
    logger.warn('DataGrid Error:', error.message);
    return Promise.resolve();
  }

  const colDefs: GridColumns = [
  { field: 'id', flex: 0.1 },
  {
    field: 'user', headerName: 'Member',
    description: 'User who is a member ',
    editable: true,
    flex: 5,
    type: 'singleSelect',
    valueFormatter: (params: GridValueFormatterParams) =>
    {
      const skip = (key, value) => {
        if ( key ==='api' ) { return undefined; }
        return value;
      };
      if ( !params.value || undefined === params.value ) { return ''; }
      //logger.log('Formatting value for:', params);
      //return printGyet(JSON.parse(params.value));
      //return printGyet(params.value);
      // params.value is the user ID, need to find the actual user object
      //const user = usersList.items.find(u => u?.id === params.value);
      //return user ? printGyet(user) : '';
      return printGyet(JSON.parse(params.value));
    },
     valueGetter: (params) => {
        // Extract user ID for select matching
        //return params.row.user?.id || '';
        //return params.row.user || emptyUser;
        return JSON.stringify(params.row.user || emptyUser);
     },
     valueSetter: (params) => {
        logger.log('valueSetter called - row ID:', params.row.id,
                   ', selected value:', params.value);
        // Handle empty selection
        if (!params.value || emptyUser.id === params.value.id)
        {
           logger.log('valueSetter: storing empty user for row', params.row.id);
           editedRowsRef.current[params.row.id] = { ...params.row, user: { ...emptyUser } };
           return { ...emptyUser };
           //return JSON.stringify(emptyUser);
           //return emptyUser.id;
        }
        // params.value is the selected user ID
        // Find the complete user object and store it in the field
        //const selectedUser = usersList.items.find(u => u.id === params.value) || emptyUser;
        const selectedUser = JSON.parse(params.value);
        const copyCat = { ...selectedUser };
        editedRowsRef.current[params.row.id] = { ...params.row, user: copyCat };

        logger.log('valueSetter: storing updated row for', params.row.id,
                   ':', editedRowsRef.current[params.row.id]);
        return selectedUser; // Store complete user object in field
        //return { ...copyCat };
        //return JSON.stringify(copyCat);
        //return params.value;
     },
    /* * /
    valueGetter: (params) => //{ return JSON.stringify(params.row.user) },
    {
      //logger.log('getting value:', params.value);
      const retVal = params.row.user;
      //logger.trace('getting value:', retVal);
      return JSON.stringify(retVal);
    },
    // */
    /* * /
    valueSetter: (params) =>
    {
      // logger.log('value to set:', params.value`);
      const selectedUser = JSON.parse(params.value);
      //const selectedUser = params.value;

      logger.log('valueSetter called - selectedUser.id:', selectedUser.id,
                 'params.row.user.id:', params.row?.user?.id);
      logger.log('Are they equal?', (params.row?.user?.id === selectedUser.id));

      // if ( !selectedUser.id || emptyUser.id === selectedUser.id
      //   || params.row?.user?.id === selectedUser.id )
      //    //{ return params.row; }
      // {
      //   logger.log(`valueSetter: returning same row (no change needed)`);
      //   return params.row;
      // }
      //
      // const row = { ...params.row, user: selectedUser, isNew: params.row.isNew }
      //if ( !row.id ) { row.id = randomUUID(); }
      //if ( !row.id ) { row.id = hashUUID(selectedUser.id, box.id); }
      //row.id = hashUUID(selectedUser.id, box.id);
      //setEditRows(prev => ({ ...prev, [row.id]: row }));
      //Store edited row
      //editedRowsRef.current[row.id] = row;

       // if ( selectedUser.id && emptyUser.id !== selectedUser.id
       //   && selectedUser.id !== params.row?.user?.id )
       // {
       //    //const row = { ...params.row, user: {...selectedUser}, isNew: params.row.isNew };
       //    params.row.user = {...selectedUser};
       //    editedRowsRef.current[params.row.id] = params.row;
       //
       //    logger.log('setting:', params.row`);
       //    //logger.log('original Members:', members);
       //    //return row;
       // }

       //return params.row;
       return params.row.user;

      // moved to `processRowUpdate` for correctness
      //need to update the state for save to find it.
      // if ( members )
      // {
      //   let newMembers: typeof members;
      //   const index = members.findIndex(r => r?.id === row.id);
      //   if ( -1 < index )
      //   {
      //     newMembers = [...members];
      //     newMembers[index] = { ...row };
      //     logger.log('updated Members[',index,'] to be:', newMembers[index]);
      //     setMembers(newMembers);
      //   }
      // }
      //
      // if ( members )
      // {  //update state AFTER render
      //    setTimeout(() => {
      //       let newMembers: typeof members;
      //       const index = members.findIndex(r => r?.id === row.id);
      //       if ( -1 < index )
      //       {
      //         newMembers = [...members];
      //         newMembers[index] = { ...row };
      //         logger.log('updated Members[',index,'] to be:', newMembers[index]);
      //         setMembers(newMembers);
      //       }
      //    }, 0);
      // }
      //return row; //function contract, return updated row
    },
    */
    valueOptions: userOptionList,
    /*
    preProcessEditCellProps: (params) => {
      const selectedUser = JSON.parse(params.props.value);
      if (selectedUser.id && selectedUser.id !== emptyUser.id)
      {  // Update the row in members state immediately
         const updatedRow = { ...params.row, user: selectedUser };
         editedRowsRef.current[params.id] = updatedRow;
      }
      return { ...params.props };
    },
    */
  },

  {
     field: 'role', headerName: 'Role',
     description: 'Level of Access to items in the box.',
     editable: true, flex: 1,
     type: 'singleSelect',
     valueOptions: rolesList as ValueOptions[],
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
          <GridActionsCellItem id='Success' color='success'
            icon={<SaveIcon />} label="Save" placeholder='Save'
            onClick={handleSaveClick(params)} showInMenu={false}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />,
          <GridActionsCellItem id='Cancel' label="Cancel"
            sx={{ color: theme.palette.secondary.main }}
            icon={<CancelIcon />} placeholder='Cancel'
            className="textPrimary" color="inherit"
            onClick={handleCancelClick(id)} showInMenu={false}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />,
        ];
      }

      return [
        <GridActionsCellItem id='Edit' placeholder='Edit'
          icon={<EditIcon htmlColor={theme.palette.info.dark} />}
          label="Edit" className="textPrimary"
          disabled={params.row.boxUserUserId === params.row.box.xbiisOwnerId}
          onClick={handleEditClick(id)} showInMenu={false}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />,
        <GridActionsCellItem id='Delete' icon={<DeleteIcon />}
          sx={{ color: theme.palette.secondary.main }}
          label="Delete" color="inherit" placeholder='Delete'
          disabled={params.row.boxUserUserId === params.row.box.xbiisOwnerId}
          onClick={handleDeleteClick(id)} showInMenu={false}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />,
      ];
    },
  },
  ];

  /*
  if ( isDevLocation() )
  {
     const skipBox = (key, val) => {
       if ( key === 'box' ) { return undefined; }
       return val;
     }
     logger.log(`Rows for ${JSON.stringify(members, skipBox, 2)}`);
  }
  */

  return (
      <DataGrid autoHeight
        //apiRef={apiRef}
        editMode="row" rowModesModel={rowModesModel}
        rows={members!} columns={colDefs}
        //columnVisibilityModel={{id: false }}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={processRowUpdateError}
        components={{ Toolbar: EditToolbar, }}
        componentsProps={{ toolbar: { setMembers, setRowModesModel }, }}
        experimentalFeatures={{ newEditingApi: true }}
        disableVirtualization={disableVirtualization}
      />
  );
}

export default BoxMembersList;