import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { makeStyles, withStyles } from "tss-react/mui";
import { GlobalStyles } from 'tss-react';

import { theme } from './theme';
import ovoid from '../../images/ovoid.jpg';
import {emptyGyet, Gyet} from '../../User/userType';
import { ReduxState } from '../../app/reducers';
import { searchPlaceholder } from '../pages/SearchResults';

import { 
  DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
  LOGOUT_PATH, LOGIN_PATH,
  USER_PATH, CURRENT_USER_PATH,
  ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
  ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH
 } from './constants';


const useStyles = makeStyles()(
    (theme) => ({
       "header": 
       {
        marginBottom: 0,
        paddingBottom: 0,
        display: 'inline-flex',
        //verticalAlign: 'baseline',
        alignItems: 'baseline',
        //alignContent: 'baseline',
       },
       "logo": 
       { 
         height: '32px',
         padding: theme.spacing(2),
       },
       "headerLink":
       {
        paddingBottom: 0,
        borderRadius: theme.shape.borderRadius,
        borderBottomWidth: '7px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent',
        "&:hover":
        { borderBottomColor: theme.palette.secondary.main, }
       },
       "headerSearch":
       {
         borderRadius: theme.shape.borderRadius,
         height: '70%',
         //alignContent: 'bottom',
         //marginTop: '0',
         //alignItems: 'middle',
         backgroundColor: alpha(theme.palette.common.white, 0.25),
         borderBottomColor: alpha(theme.palette.common.white, 0.0),
         "&:hover": { borderBottomColor: theme.palette.secondary.main, },
         "&:focus-within": { borderBottomColor: theme.palette.secondary.main, },
         "&:active": { borderBottomColor: theme.palette.secondary.main, },
         "& input": 
         { 
            color: theme.palette.primary.contrastText, 
            "&::placeholder": { opacity: 0.75 },
         },
       },
    })
);

//TODO: extract Type and Maps to another file

//page or link type
export interface pageLink { name: string; path: string; };

//TODO: use constants and localize name values
export const pageMap: pageLink[] = [
       { name: "Txa'nii Hałels(Dashboard)", path: DASHBOARD_PATH},
       { name: "Ma̱ngyen (Upload)",          path: UPLOAD_PATH},
       //NOTE: leave search at the end.
       { name: 'Gügüül(Search)',            path: SEARCH_PATH }
];

export const adminMenuMap: pageLink[] = [
   { name: "All Users", path: ADMIN_USERLIST_PATH},
   { name: "All Boxes", path: ADMIN_BOXLIST_PATH}
];

//TODO: Profile Vs Account (user info vs authored Documents?)
export const userMenuMap: pageLink[] = [
       { name: "'Nüüyu (Profile)",        path: USER_PATH},
       //{ name: 'Account',                 path: '/xbiis'}, //box?
       { name: "Wayi ła sabaat (Logout)", path: LOGOUT_PATH}
];

export const siteName = 'Smalgyax-Files';

export const Login = "Ts'iin (Login)";

export const AdminMenuHeader = 'Admin Menu';

const ResponsiveAppBar = () => 
{
  const navigate = useNavigate();

  const [anchorElNav,   setAnchorElNav]   = useState<null | HTMLElement>(null);
  const [anchorAdminEl, setAnchorAdminEl] = useState<null | HTMLElement>(null);
  const [anchorElUser,  setAnchorElUser]  = useState<null | HTMLElement>(null);

  //search string/terms
  const [keywords,      setKeywords]        = useState('');
  //sort results
  const [sortBy,        setSortBy]          = useState(''); //TODO: set defaults here
  const [sortDirection, setSortDirection]   = useState('ASC');
  //pagination
  const [start,         setStart]           = useState(0);
  const [count,         setCount]           = useState(25); //TODO: adjust default length

  //TODO: extract searchUtilities

  const performSearch = () =>
  {
    const encodedKw = encodeURIComponent(keywords);
    const searchPage = `${pageMap[pageMap.length-1].path}?q=${encodedKw}`;
    console.log(`Redirecting to search page. ${searchPage}`);
    navigate(`${pageMap[pageMap.length-1].path}?q=${encodedKw}`);
  }
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) =>
  { //check for enter
    const isEnterKey = ( 'Enter' === e.key || 'Enter' === e.code
                      || 'NumpadEnter' === e.code
                      || 13 === e.which || 13 === e.keyCode );
    if ( isEnterKey )
    { //load search page w/ params
      console.log('Enter detected, performing search.');
      performSearch();
    }
    else { console.log(`Keydown Not Enter: ${e.key}`); }
  };

  const handleSearchFieldChange = (kw: string) => { setKeywords(kw); };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorElNav(event.currentTarget); };

  const handleOpenAdminMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorAdminEl(event.currentTarget); };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorElUser(event.currentTarget); };

  const handleCloseNavMenu   = () => { setAnchorElNav(null); };
  const handleCloseAdminMenu = () => { setAnchorAdminEl(null); };
  const handleCloseUserMenu  = () => { setAnchorElUser(null); };

  const { classes: css, cx } = useStyles();

  const user = useSelector<ReduxState, Gyet>(state => state.currentUser);

  //should this only check id?
  const isAuth = user !== emptyGyet;
  //const isAuth = false;
  const isAdmin = isAuth && user.isAdmin;
  const openAdmin = Boolean(anchorAdminEl);

  let adminMenu : JSX.Element[] = [];
  if ( isAdmin )
  { //build admin Drop down menu
    adminMenu.push(
      <Box key='adminMenu'
           sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
           className={cx(css.header)} >
        <Button id="admin-button" className={cx(css.headerLink, css.header)}
                aria-controls={openAdmin ? 'admin-menu' : undefined}
                aria-expanded={openAdmin ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleOpenAdminMenu}
                style={{color: theme.palette.primary.contrastText}}
        >
        <Typography textAlign="center" className={cx(css.header)}>
          {AdminMenuHeader}
        </Typography>
        </Button>
        <Menu
          id="admin-menu"
          //keepMounted
          anchorEl={anchorAdminEl}
          //anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
          //transformOrigin={{ vertical: 'top', horizontal: 'left', }}
          open={openAdmin}
          onClose={handleCloseAdminMenu}
          //sx={{ display: { xs: 'block', md: 'none' }, }}
        >
          { adminMenuMap.map(({name, path}) =>
             <MenuItem key={name} component={Link} href={path}>
                <Typography textAlign="center" >{name}</Typography>
             </MenuItem>
          )}
        </Menu>
      </Box>
    );
  }
  else { adminMenu.push(<></>) }

  const buildSearchField = (id: string) => {
      return (
      <TextField variant='filled'
                 placeholder={searchPlaceholder}
                 className={cx(css.headerLink, css.header, css.headerSearch)}
                 onChange={(e) => handleSearchFieldChange(e.target.value)}
                 onKeyDown={e => handleSearchKeyDown(e)}
                 sx={{padding:0, }}
                 InputProps={{ 'aria-label': 'search',
                     startAdornment: (
                         //TODO: make this a button, to search with an onClick
                         <InputAdornment position='start'>
                             <SearchIcon className='headerSearchIcon'
                                         sx={{ color: theme.palette.primary.contrastText}}
                                         style={{ paddingBottom: '11px' }}
                                         onClick={performSearch}/>
                         </InputAdornment>
                     ),
                     id: id,  hiddenLabel: true,
                     margin: 'dense', sx:{ padding:0 }
                 }} />
      );
}

  return (
    <>
    <GlobalStyles styles={{
        '#menu-appbar .MuiPaper-root':
        { 
          backgroundColor: theme.palette.primary.light, 
          color: theme.palette.primary.contrastText
        },
        '#menu-appbar-hidden .MuiPaper-root':
        { 
          backgroundColor: theme.palette.primary.light, 
          color: theme.palette.primary.contrastText
        },
        '#admin-menu .MuiPaper-root':
        {
          backgroundColor: theme.palette.primary.light, 
          color: theme.palette.primary.contrastText
        },
        '#searchId': { padding: '1.5%' },
      }} 
    />
    <AppBar position="static" className={cx(css.header)} >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Menu when width is too narrow */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="Navigation Menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-hidden"
              keepMounted
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }, }}
            >
              {pageMap.map(({name, path}) => (
                <MenuItem key={name} component={Link} href={path}
                          className={cx(css.headerLink)}>
                  <Typography textAlign="center" >{name}</Typography>
                </MenuItem>
              ))}
              <MenuItem>{buildSearchField('searchId-hidden')}</MenuItem>
            </Menu>
          </Box>

         {/* Logo Icon & Site Name */}
          <Box sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} >
            <img src={ovoid} alt="logo" className={cx(css.logo)} />
          </Box>
          <Typography variant="h5" noWrap component="a" href="/"
             sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, flexGrow: 1,
                   fontFamily: 'monospace', fontWeight: 700,
                   letterSpacing: '.3rem',
                   color: 'inherit', textDecoration: 'none',
                }}
          >
            {siteName}
          </Typography>

          {/* Header Tabs for Widescreen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(css.header)} >
            {pageMap.map(({name, path}) => (
              <Button key={name} component={Link} href={path}
                      className={cx(css.headerLink, css.header)}
                      sx={{ my: 2, color: 'white', display: 'block' }} >
                <Typography textAlign="center" className={cx(css.header)}>
                  {name}
                </Typography>
              </Button>
            ))}
            {adminMenu}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(css.header)} >
            {buildSearchField('searchId')}
          </Box>

          { isAuth && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* 
                  * consider gravatar or identity provider account images
                  * If so, use Icon as a fallback.
                  * 
                  * How should I handle both Kampshiwamp and Smalgyax Names? 
                  */}
                <Avatar alt={user.name}
                        sx={{bgcolor: theme.palette.secondary.main}}>
                   <AccountCircleIcon/>
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="user-menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right', }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenuMap.map(({name, path}) => (
                <MenuItem key={name} component={Link} href={path} >
                  <Typography textAlign="center" >{name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          )}
          { !isAuth && (
            // TODO: Update and verify once AWS Cognito is integrated
            <Button key='login' component={Link} href={LOGIN_PATH}
                    className={cx(css.headerLink, css.header)}
                    sx={{ my: 2, color: 'white', display: 'block' }} >
              <Typography textAlign="center" className={cx(css.header)}>
                 {Login}
              </Typography>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};

export default ResponsiveAppBar;
