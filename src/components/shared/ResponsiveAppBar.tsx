import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from "@aws-amplify/ui-react";

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

import { makeStyles } from "tss-react/mui";
import { GlobalStyles } from 'tss-react';

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import { theme } from './theme';
import ovoid from '../../images/ovoid.jpg';
import {emptyUser} from '../../User/userType';
import {isEnterKey, searchPlaceholder} from '../pages/SearchResults';

import {
   DASHBOARD_PATH, ITEM_PATH, UPLOAD_PATH, SEARCH_PATH,
   LOGIN_PATH,
   USER_PATH, CURRENT_USER_PATH,
   ADMIN_USERLIST_PATH, ADMIN_USER_PATH,
   ADMIN_BOXLIST_PATH, ADMIN_BOXMEMBERS_PATH, AUTHOR_PATH, AUTHORLIST_PATH
} from './constants';
import {Feedback} from "./Feedback";


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
         boxSizing:'content-box',
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

//page or link type
export interface pageLink { name: string; path: string; };

//TODO: use constants and localize name values
export const pageMap: pageLink[] = [
       { name: "Txa'nii Hałels (Dashboard)", path: DASHBOARD_PATH},
       { name: "Ma̱ngyen (Upload)",          path: UPLOAD_PATH},
       { name: "'Niism Na T'amt (Authors)", path: AUTHORLIST_PATH},
       //NOTE: leave search at the end.
       { name: 'Gügüül (Search)',            path: SEARCH_PATH }
];

export const adminMenuMap: pageLink[] = [
   { name: "All Users", path: ADMIN_USERLIST_PATH},
   { name: "All Boxes", path: ADMIN_BOXLIST_PATH}
];


export const PROFILE = "'Nüüyu (Profile)";

export const siteName = 'Smalgyax-Files';

export const Login = "Ts'iin (Login)";

export const AdminMenuHeader = 'Admin Menu';

const ResponsiveAppBar = () => 
{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorElNav,   setAnchorElNav]   = useState<null | HTMLElement>(null);
  const [anchorAdminEl, setAnchorAdminEl] = useState<null | HTMLElement>(null);
  const [anchorElUser,  setAnchorElUser]  = useState<null | HTMLElement>(null);

  //search string/terms
  const [keywords,      setKeywords]        = useState('');

  const LoadSearchPage = () =>
  { //load search page w/ params
    const encodedKw = encodeURIComponent(keywords);
    const searchPage = `${pageMap[pageMap.length-1].path}?q=${encodedKw}`;
    console.log(`Redirecting to search page. ${searchPage}`);
    navigate(`${pageMap[pageMap.length-1].path}?q=${encodedKw}`);
  }
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) =>
  { //check for enter
    if (isEnterKey(e))
    { //trigger function to perform the search
      // console.log('Enter detected, performing search.');
      LoadSearchPage();
    }
    //else { console.log(`Keydown Not Enter: ${e.key}`); }
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

  const openAdmin = Boolean(anchorAdminEl);

  const { classes: css, cx } = useStyles();

  const user = /*useAppLookupSelector<User>(state => state.currentUser,
                                                dispatch(currentUserActions.getCurrentUser()),
                                                isEmptyUser);*/
     useAppSelector(state => state.currentUser);
  const { signOut } = useAuthenticator(context => [context.user]);
  const isAuth = () => { return user.id !== emptyUser.id }
  //const [isAdmin, setIsAdmin] = useState(isAuth() && user.isAdmin);
  const isAdmin = !!(isAuth() && user.isAdmin);

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
          //anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
          //transformOrigin={{ vertical: 'top', horizontal: 'left', }}
          open={openAdmin}
          onClose={handleCloseAdminMenu}
          //sx={{ display: { xs: 'block', md: 'none' }, }}
        >
          { adminMenuMap.map(({name, path}) =>
             <MenuItem key={`admin-${name}`} component={Link} href={path}>
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
                         <InputAdornment position='start'>
                             <SearchIcon className='headerSearchIcon'
                                         sx={{ color: theme.palette.primary.contrastText}}
                                         style={{ paddingBottom: '11px' }}
                                         onClick={LoadSearchPage}/>
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
                <MenuItem key={`menu-${name}`} component={Link} href={path}
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
             key='Menu-siteName'
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
              <Button key={`wide-${name}`} component={Link} href={path}
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

          { isAuth() && (
          <Box sx={{ flexGrow: 0 }} style={{marginLeft: '1.5em'}}>
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
              <MenuItem key='profile' component={Link} href={USER_PATH} >
                <Typography textAlign="center" >'Nüüyu (Profile)</Typography>
              </MenuItem>
              <MenuItem key='signout' component={Button} onClick={signOut} >
                <Typography textAlign="center" >Wayi ła sabaat (Logout)</Typography>
              </MenuItem>
            </Menu>
          </Box>
          )}
          { !isAuth() && (
            <Button key='login' component={Link} href={LOGIN_PATH}
                    className={cx(css.headerLink, css.header)}
                    sx={{ my: 2, color: 'white', display: 'block' }} >
              <Typography textAlign="center" className={cx(css.header)}>
                 {Login}
              </Typography>
            </Button>
          )}
          <Feedback />
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};

export default ResponsiveAppBar;
