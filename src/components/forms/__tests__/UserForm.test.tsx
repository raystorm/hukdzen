import react from 'react'
import { render, screen } from '@testing-library/react'

import { Gyet } from '../../../User/userType';
import { Clan, printClanType } from "../../../User/ClanType";
import { BoxRole, emptyBoxRole, printBoxRole } from "../../../User/BoxRoleType";
import { Role } from '../../../Role/roleTypes';
import { Xbiis } from '../../../Box/boxTypes';
import { BoxList } from '../../../Box/BoxList/BoxListType';
import UserForm from '../UserForm'
import { contains, loadTestStore, renderWithProviders, renderWithState, startsWith } from '../../../utilities/testUtilities';



//TODO: test constants
let TEST_USER: Gyet = {
  id:       'GUID goes here',
  name:     'testy McTesterson',
  email:    'fake@example.com',
  clan:     Clan.Wolf,
  waa:      'Nabibuut Dan',
  isAdmin:  false,
  boxRoles: []
  //boxRoles: [{box: TEST_STATE.boxList.boxes[0], role: Role.ReadOnly }]
};

const TEST_BOXES = [
  {
    id: 'GUID_ID_1',  name: 'TEST 1',
    owner: {...TEST_USER}, defaultRole: Role.ReadOnly,
  },
  {
    id: 'GUID_ID_2',  name: 'TEST 2',
    owner: {...TEST_USER}, defaultRole: Role.Write,
  }
] as Xbiis[];

//Fix for Circular Dependency between Boxes and User.
TEST_USER.boxRoles = [
  { 
    box: { ...TEST_BOXES[0] },
    role: Role.ReadOnly 
  }
];

let TEST_STATE = {
  currentUser: { ...TEST_USER },
  boxList: { boxes: TEST_BOXES } as BoxList
};

describe('UserForm', () => { 
  
  test('UserForm renders correctly', async () => 
  { 
    const USER = TEST_USER;
    console.log(JSON.stringify(USER));
    
    renderWithState(TEST_STATE, <UserForm user={USER}/>);

    expect(screen.getByTestId('id')).toBeInTheDocument();
    expect(screen.getByTestId('id')).not.toBeVisible();
    
    //regex for startsWith
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue(USER.name);
    
    expect(screen.getByLabelText(/^E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail/)).toHaveValue(USER.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);
    

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);
    
    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    
    //NOTE: there should be a cleaner syntax for this
    //if ( TEST_USER.isAdmin ) { expect(isAdmin).toBeChecked(); }
    //else { expect(isAdmin).not.toBeChecked(); }
    //checked only appears when TRUE, but doesn't look as clean as the if/Else
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByText(startsWith('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    const boxRole = TEST_USER.boxRoles[0]
    expect(screen.getByText(boxRole.box.name)).toBeInTheDocument();
    expect(screen.getByText(boxRole.role.name)).toBeInTheDocument();
  });

  test('UserForm renders correctly for Admin User', async () => 
  { 
    const USER  = { ...TEST_USER,  isAdmin: true };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } }
    
    renderWithState(STATE, <UserForm user={USER}/>);

    expect(screen.getByTestId('id')).toBeInTheDocument();
    expect(screen.getByTestId('id')).not.toBeVisible();
    
    //regex for startsWith
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue(USER.name);
    
    expect(screen.getByLabelText(/^E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail/)).toHaveValue(USER.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);
    
    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);
    
    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    
    //NOTE: there should be a cleaner syntax for this
    //if ( TEST_USER.isAdmin ) { expect(isAdmin).toBeChecked(); }
    //else { expect(isAdmin).not.toBeChecked(); }
    //checked only appears when TRUE, but doesn't look as clean as the if/Else
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByLabelText(contains('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    expect(screen.getByText(`${printBoxRole(TEST_USER.boxRoles[0])}`))
      .toBeInTheDocument();
  });
})