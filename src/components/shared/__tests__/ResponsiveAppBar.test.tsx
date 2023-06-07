import react, {useEffect, useRef} from 'react'
import { MemoryRouter } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
//import mediaQuery from 'css-mediaquery';
import 'window-resizeto/polyfill';

import {
  renderWithState,
  LocationDisplay,
  startsWith,
  contains, renderWithAuthenticator
} from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import ResponsiveAppBar,
       {
         siteName,
         Login,
         pageLink,
         pageMap,
         adminMenuMap,
         /*userMenuMap*/
         PROFILE,
       }
       from "../ResponsiveAppBar";
import { searchPlaceholder } from '../../pages/SearchResults';

const TEST_USER: User = {
  ...emptyUser,
  id: 'TEST_GUID_HERE',
  name: 'Testy Mc TestPants',
  email: 'DoNotEmailMe@example.com',
}

const TEST_ADMIN: User = {
  ...emptyUser,
  id: 'ADMIN_GUID_HERE',
  name: 'Administrator frowny face :(',
  email: 'Admin_My_Admin@example.com',
  isAdmin: true,
}

const searchParams = 'SearchTerm';

const NO_USER_STATE = { currentUser: emptyUser };

const USER_STATE = { currentUser: TEST_USER };

const ADMIN_STATE = { currentUser: TEST_ADMIN };

userEvent.setup();

/*
const createMatchMedia = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => {},
  removeListener: () => {}
});
*/

function createMatchMedia(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      //matches: mediaQuery.match(query, { width }),
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

const Dim = () =>
{
  const windowWidth  = useRef(window.innerWidth);
  const windowHeight = useRef(window.innerHeight);

  return (
     <div>
       Dimensions: <br />
       <p>{`Width:  ${windowWidth.current}`.trim()}</p>
       <p>{`Height: ${windowHeight.current}`.trim()}</p>
     </div>
  );
}

const SetWidth = (width: number) => {
  //useEffect(() => { window.resizeTo(width, window.outerHeight) }, []);
  window.resizeTo(width, window.outerHeight);

  return <Dim />;
}

/*
beforeEach(() =>
{
  window.scrollTo = jest.fn();
  window.HTMLDivElement.prototype.scrollIntoView = jest.fn();
});
*/

const verifyMenuMap = ( menuMap: pageLink[] ) => {
  menuMap.forEach(({name, path}) => {
    expect(screen.getByText(name)).toBeVisible();
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText(name).parentElement).toHaveAttribute('href', path);
  });
}

const verifyPageMap = (index: number) => {
  pageMap.forEach(({ name, path }) => {
    const option = screen.getAllByText(name)[index];
    screen.debug(option);
    expect(option).toBeVisible();
    // eslint-disable-next-line testing-library/no-node-access
    expect(option.parentElement).toHaveAttribute('href', path);
  });
}

const validateUserMenu = async () =>
{
  await userEvent.click(screen.getByTestId('AccountCircleIcon'));

  await waitFor(() => {
    expect(screen.getByText(PROFILE)).toBeVisible();
  });

  //verifyMenuMap(userMenuMap);

  // click on the modal backdrop to close the menu
  // @ts-ignore
  // eslint-disable-next-line testing-library/no-node-access
  await userEvent.click(screen.getAllByRole('presentation')[0].firstChild);

  await waitFor(() => {
    expect(screen.getByText(PROFILE)).not.toBeVisible();
  });
}

describe('Responsive App Bar', () => {

  /*
   *  *NOTE:* Tests, only check if Items are visible,
   *          JSDOM doesn't handle mediaQueries, so checking NOT visible IS HARD
   */

  test('renders correctly without a logged in user (default width)', () => {
    renderWithAuthenticator(NO_USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility (wide?)
    expect(screen.getByText(siteName)).toBeVisible();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });

    /*
    userMenuMap.forEach(({name, path}) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });
    */
    expect(screen.queryByText(PROFILE)).not.toBeInTheDocument();

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();

    expect(screen.getByText(Login)).toBeInTheDocument();
  });

  test('renders correctly for a user (default width)', async () => {
    renderWithAuthenticator(USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);
    
    //check visibility (wide?)
    expect(screen.getByText(siteName)).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    verifyPageMap(0);

    await validateUserMenu();

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for a user on a narrow screen', async () => {
    //global.innerWidth = 500;
    //window.resizeTo(500, 768);
    //createMatchMedia(500);
    //renderWithState(state, <BrowserRouter><ResponsiveAppBar />{SetWidth(500)}</BrowserRouter>);
    //window.innerWidth = 500;

    renderWithAuthenticator(USER_STATE, <BrowserRouter><ResponsiveAppBar /><Dim /></BrowserRouter>);

    //check visibility
    expect(screen.getByText(siteName)).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Navigation Menu'));

    await waitFor(() => {
      expect(screen.getAllByText(pageMap[0].name)[1]).toBeVisible();
    });

    verifyPageMap(1);

    // click on the modal backdrop to close the menu
    // @ts-ignore
    // eslint-disable-next-line testing-library/no-node-access
    await userEvent.click(screen.getAllByRole('presentation')[0].firstChild);

    await waitFor(() =>
    { expect(screen.getAllByText(pageMap[0].name)[1]).not.toBeVisible(); });

    await validateUserMenu();

    //Admin Menu isn't listed for narrow screens (yet)
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for an admin on a narrow screen', async () => {
    //global.innerWidth = 500;
    //window.resizeTo(500, 768);
    //createMatchMedia(500);
    //renderWithState(state, <BrowserRouter><ResponsiveAppBar />{SetWidth(500)}</BrowserRouter>);
    //window.innerWidth = 500;

    renderWithAuthenticator(ADMIN_STATE, <BrowserRouter><ResponsiveAppBar /><Dim /></BrowserRouter>);

    //check visibility
    expect(screen.getByText(siteName)).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Navigation Menu'));

    await waitFor(() => {
      expect(screen.getAllByText(pageMap[0].name)[1]).toBeVisible();
    });

    verifyPageMap(1);

    await validateUserMenu();

    //Admin Menu isn't listed for narrow screens (yet), but visible in "wide"
    //expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for an admin on a wide screen', async () => {
    //window.matchMedia = createMatchMedia(2048);
    createMatchMedia(2048);
    renderWithAuthenticator(ADMIN_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility
    expect(screen.getByText(siteName)).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    verifyPageMap(0);

    await validateUserMenu();

    const adminMenu = screen.getByText('Admin Menu');

    expect(adminMenu).toBeInTheDocument();

    await userEvent.click(adminMenu);

    await waitFor(() => {
      expect(screen.getByText(adminMenuMap[0].name)).toBeInTheDocument();
    });

    verifyMenuMap(adminMenuMap);

    // click on the modal backdrop to close the menu
    // @ts-ignore
    // eslint-disable-next-line testing-library/no-node-access
    await userEvent.click(screen.getAllByRole('presentation')[0].firstChild);

    await waitFor(() =>
    { expect(screen.getByText(adminMenuMap[0].name)).not.toBeVisible(); });
  });

  test('renders correctly for a user on a wide screen', async () => {
    //window.matchMedia = createMatchMedia(2048);
    createMatchMedia(2048);
    renderWithAuthenticator(USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility
    expect(screen.getByText(siteName)).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    verifyPageMap(0);

    await validateUserMenu();

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  /*
   * Search Tests
   */

  test('user can search with the search field for an empty value', async () => {
    const pageUrl = `/`;
    renderWithAuthenticator(USER_STATE,
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ResponsiveAppBar />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location')).toHaveTextContent(pageUrl);

    const searchField = screen.getAllByPlaceholderText(searchPlaceholder)[0];

    await userEvent.clear(searchField);
    await userEvent.type(searchField, '[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search');
    });
  });

  test('user can search with the search field', async () => {
    const pageUrl = `/`;
    renderWithAuthenticator(USER_STATE,
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ResponsiveAppBar />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location')).toHaveTextContent(pageUrl);

    const searchField = screen.getAllByPlaceholderText(searchPlaceholder)[0];

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search?q=test');
    });
  });

});