import react, {useEffect, useRef} from 'react'
import { MemoryRouter } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';
import 'window-resizeto/polyfill';

import {
         renderWithState,
         LocationDisplay,
         startsWith,
         contains
       } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyGyet, Gyet} from '../../../User/userType';
import ResponsiveAppBar,
       { siteName, Login, pageLink, pageMap, adminMenuMap, userMenuMap }
       from "../ResponsiveAppBar";
import { searchPlaceholder } from '../../pages/SearchResults';

const TEST_USER: Gyet = {
  id: 'TEST_GUID_HERE',
  name: 'Testy Mc TestPants',
  email: 'DoNotEmailMe@example.com',
}

const TEST_ADMIN: Gyet = {
  id: 'ADMIN_GUID_HERE',
  name: 'Administrator frowny face :(',
  email: 'Admin_My_Admin@example.com',
  isAdmin: true,
}

const searchParams = 'SearchTerm';

const NO_USER_STATE = { currentUser: emptyGyet };

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

function createMatchMedia(width) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: mediaQuery.match(query, { width }),
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

  //console.log('width:  ', windowWidth.current);
  //console.log('height: ', windowWidth.current);

  return (
     <div>
       Dimensions: <br />
       <p>{`Width:  ${windowWidth.current}`.trim()}</p>
       <p>{`Height: ${windowHeight.current}`.trim()}</p>
     </div>
  );
}

const SetWidth = (width: number) => {
  //useEffect(() => { window.resizeTo(width, 768) }, []);
  window.resizeTo(width, 768);

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
    expect(screen.getByText(name)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText(name).parentElement).toHaveAttribute('href', path);
  });
}

describe('Responsive App Bar', () => {

  /*
   *  *NOTE:* Tests, only check if Items are visible,
   *          JSDOM doesn't handle mediaQueries, so checking NOT visible IS HARD
   *
   * TODO: Tests
   *     + wide screen
   *     + narrow screen
   *     + search fields
   *       + Wide Screen
   *       + Narrow
   *     + admin only for admin
   *     + User Menu
   *
   *  **NOTE:** JS-DOM doesn't handle @Media Queries. Need a solution.
   *            MUI just tests that the @Media-CSS exists. :(
   */

  test('renders correctly without a logged in user (default width)', () => {
    renderWithState(NO_USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility (wide?)
    expect(screen.getAllByText(startsWith(siteName))[0]).toBeVisible();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });

    userMenuMap.forEach(({name, path}) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();

    expect(screen.getByText(Login)).toBeInTheDocument();
  });

  test('renders correctly for a user (default width)', () => {
    renderWithState(USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);
    
    //check visibility (wide?)
    expect(screen.getAllByText(startsWith(siteName))[0]).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });

    verifyMenuMap(userMenuMap);

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for a user on a narrow screen', () => {
    //global.innerWidth = 500;
    //window.resizeTo(500, 768);
    //createMatchMedia(500);
    //renderWithState(state, <BrowserRouter><ResponsiveAppBar />{SetWidth(500)}</BrowserRouter>);
    //window.innerWidth = 500;

    renderWithState(USER_STATE, <BrowserRouter><ResponsiveAppBar /><Dim /></BrowserRouter>);

    //screen.debug(screen.getAllByText(startsWith(siteName)));
    //screen.debug(screen.getByText(contains('Dimensions:')));

    //check visibility
    //expect(screen.queryAllByText(startsWith(siteName))[0]).not.toBeVisible();

    expect(screen.queryAllByText(startsWith(siteName))[1]).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[1]).toBeInTheDocument();
    });

    verifyMenuMap(userMenuMap);

    //Admin Menu isn't listed for narrow screens (yet)
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for an admin on a narrow screen', () => {
    //global.innerWidth = 500;
    //window.resizeTo(500, 768);
    //createMatchMedia(500);
    //renderWithState(state, <BrowserRouter><ResponsiveAppBar />{SetWidth(500)}</BrowserRouter>);
    //window.innerWidth = 500;

    renderWithState(ADMIN_STATE, <BrowserRouter><ResponsiveAppBar /><Dim /></BrowserRouter>);

    //screen.debug(screen.getAllByText(startsWith(siteName)));
    //screen.debug(screen.getByText(contains('Dimensions:')));

    //check visibility
    //expect(screen.queryAllByText(startsWith(siteName))[0]).not.toBeVisible();

    expect(screen.queryAllByText(startsWith(siteName))[1]).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[1]).toBeInTheDocument();
    });

    verifyMenuMap(userMenuMap);

    //Admin Menu isn't listed for narrow screens (yet), but visible in "wide"
    //expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('renders correctly for an admin on a wide screen', async () => {
    //window.matchMedia = createMatchMedia(2048);
    createMatchMedia(2048);
    renderWithState(ADMIN_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility
    expect(screen.getAllByText(startsWith(siteName))[0]).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    //expect(screen.queryAllByText(startsWith(siteName))[1]).not.toBeVisible();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });

    verifyMenuMap(userMenuMap);

    const adminMenu = screen.getByText('Admin Menu');

    expect(adminMenu).toBeInTheDocument();

    await userEvent.click(adminMenu);

    await waitFor(() => {
      expect(screen.getByText(adminMenuMap[0].name)).toBeInTheDocument();
    });

    verifyMenuMap(adminMenuMap);
  });

  test('renders correctly for a user on a wide screen', () => {
    //window.matchMedia = createMatchMedia(2048);
    createMatchMedia(2048);
    renderWithState(USER_STATE, <BrowserRouter><ResponsiveAppBar /></BrowserRouter>);

    //check visibility
    expect(screen.getAllByText(startsWith(siteName))[0]).toBeVisible();
    expect(screen.queryByText(Login)).not.toBeInTheDocument();

    //expect(screen.queryAllByText(startsWith(siteName))[1]).not.toBeVisible();

    pageMap.forEach(({ name }) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });

    verifyMenuMap(userMenuMap);

    //not an admin user
    expect(screen.queryByText('Admin Menu')).not.toBeInTheDocument();
  });

  test('user can search with the search field for an empty value', async () => {
    const pageUrl = `/`;
    renderWithState(USER_STATE,
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ResponsiveAppBar />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location-display')).toHaveTextContent(pageUrl);

    const searchField = screen.getAllByPlaceholderText(searchPlaceholder)[0];

    await userEvent.clear(searchField);
    await userEvent.type(searchField, '[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location-display'))
      .toHaveTextContent('/search');
    });
  });

  test('user can search with the search field', async () => {
    const pageUrl = `/`;
    renderWithState(USER_STATE,
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ResponsiveAppBar />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location-display')).toHaveTextContent(pageUrl);

    const searchField = screen.getAllByPlaceholderText(searchPlaceholder)[0];

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location-display'))
        .toHaveTextContent('/search?q=test');
    });
  });

});