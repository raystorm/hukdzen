import React, { useState } from 'react';
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
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';

import { makeStyles, withStyles } from "tss-react/mui";
import { GlobalStyles } from 'tss-react';
import { theme } from './theme';
import ovoid from '../../resources/ovoid.jpg';
import { useSelector } from 'react-redux';
import { Gyet } from '../../User/userType';
import { ReduxState } from '../../app/reducers';

const useStyles = makeStyles()(
    (theme) => ({
       "header": 
       {
        marginBottom: '0', 
        paddingBottom: '0',
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
        paddingBottom: '0',
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

//TODO: extrace Type and Maps to another file

//page or link type
interface pageLink {
  name: string;
  address: string;
};

export const pageMap: pageLink[] = [{ name: 'Dashboard', address: '/dashboard'}, /* /malsgm, /wilaayn't */
                                    { name: 'Upload',    address: '/kyen'},
                                    //leave search at the end.
                                    { name: 'Search',    address: '/gyiitsa'}];

//TODO: Profile Vs Acount (user info vs authored Documents?)
export const userMenuMap: pageLink[] = [{ name: 'Profile', address: '/waa'},
                                        //{ name: 'Account', address: '/xbiis'}, //box?
                                        { name: 'Logout',  address: '/kwdaxs'}];


const ResponsiveAppBar = () => 
{
  const navigate = useNavigate();

  //TODO: extract Search to a component

  const [anchorElNav,   setAnchorElNav]   = React.useState<null | HTMLElement>(null);
  const [anchorAdminEl, setAnchorAdminEl] = React.useState<null | HTMLElement>(null);
  const [anchorElUser,  setAnchorElUser]  = React.useState<null | HTMLElement>(null);

  //search string/terms
  const [keywords,      setKeywords]        = useState('');
  //sort results
  const [sortBy,        setSortBy]          = useState(''); //TODO: set defaults here
  const [sortDirection, setSortDirection]   = useState('ASC');
  //pagination
  const [start,         setStart]           = useState(0);
  const [count,         setCount]           = useState(25); //TODO: adjust default length

  const performSearch = () =>
  {
    const encodedKw = encodeURIComponent(keywords);
    const searchPage = `${pageMap[pageMap.length-1].address}?q=${encodedKw}`;
    console.log(`Redirecting to search page. ${searchPage}`);
    navigate(`${pageMap[pageMap.length-1].address}?q=${encodedKw}`);
  }
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) =>
  {
    //check for enter
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

  const handleSearchFieldChange = (kw: string) =>
  { setKeywords(kw); };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorElNav(event.currentTarget); };  
  const handleOpenAdminMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorAdminEl(event.currentTarget); };  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => 
  { setAnchorElUser(event.currentTarget); };

  const handleCloseNavMenu   = () => { setAnchorElNav(null); };
  const handleCloseAdminMenu = () => { setAnchorAdminEl(null); };
  const handleCloseUserMenu  = () => { setAnchorElUser(null); };

  const { classes, cx } = useStyles();

  const user = useSelector<ReduxState, Gyet>(state => state.user);

  //const isAuth = !!user;
  const isAuth = false;
  const isAdmin = isAuth && true;
  const openAdmin = Boolean(anchorAdminEl);

  let adminMenu = []; //TODO: type this
  if ( isAdmin )
  {
    //TODO: buld admin Drop down menu here
    adminMenu.push(
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(classes.header)} >
        <Button id="admin-button"
                className={cx(classes.headerLink, classes.header)}
                aria-controls={openAdmin ? 'admin-menu' : undefined}
                aria-expanded={openAdmin ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleOpenAdminMenu}
                style={{color: theme.palette.primary.contrastText}}
        >
        <Typography textAlign="center" className={cx(classes.header)}>
          Admin Menu
        </Typography>
        </Button>
        <Menu
          id="admin-menu"
          anchorEl={anchorAdminEl}
          //anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
          //keepMounted
          //transformOrigin={{ vertical: 'top', horizontal: 'left', }}
          open={openAdmin}
          onClose={handleCloseAdminMenu}
          //sx={{ display: { xs: 'block', md: 'none' }, }}
        >
          <MenuItem key='User' component={Link} href='/admin/usersList'>
            <Typography textAlign="center" >
              All Users
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
            );
  }
  else { adminMenu.push(<></>) }

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
    <AppBar position="static" className={cx(classes.header)} >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={ovoid} alt="logo" className={cx(classes.logo)} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Smalgyax-Files
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* Menu when width is too narrow */}
            <Menu
              id="menu-appbar-hidden"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }, }}
            >
              {pageMap.map(({name, address}) => (
                <MenuItem key={name} component={Link} href={address}                
                          className={cx(classes.headerLink)}>
                  <Typography textAlign="center" >
                    {name}
                  </Typography>
                </MenuItem>
              ))}
                <MenuItem>
                <TextField variant='filled' 
                           placeholder='What are you looking for?'
                         className={cx(classes.headerLink, classes.header,
                                       classes.headerSearch)}
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
                                       id: 'searchId-hidden',  hiddenLabel: true,
                                       margin: 'dense', sx:{padding:0, }
                                       }} />
                </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} >
            <img src={ovoid} alt="logo" className={cx(classes.logo)} />
          </Box>
          <Typography variant="h5" noWrap component="a" href=""
                      sx={{ mr: 2, display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace', fontWeight: 700, 
                        letterSpacing: '.3rem',
                        color: 'inherit', textDecoration: 'none',
                      }}
          >
            Smalgyax-Files
          </Typography>
          {/* Header Tabs for Widescreen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(classes.header)} >
            {pageMap.map(({name, address}) => (
              <Button key={name} component={Link} href={address}
                      className={cx(classes.headerLink, classes.header)}
                      sx={{ my: 2, color: 'white', display: 'block' }} >
                <Typography textAlign="center" className={cx(classes.header)}>
                  {name}
                </Typography>
              </Button>
            ))}
            {adminMenu}
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(classes.header)} >
              <TextField variant='filled' placeholder='What are you looking for?'
                         className={cx(classes.headerLink, classes.header,
                                       classes.headerSearch)}
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
                                       id: 'searchId',  hiddenLabel: true,
                                       margin: 'dense', sx:{padding:0, }
                                       }} />
            </Box>
          
          {/* TODO: in AppBar Search */}
          {
            isAuth && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/*
                  * TODO: alt text from logged in user name 
                  *       src from same either user accts, or folder next to files.
                  */}
                <Avatar alt="Bob Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right', }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenuMap.map(({name, address}) => (  
                <MenuItem key={name} component={Link} href={address} >
                  <Typography textAlign="center" >{name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          )}
          { !isAuth && (
            // TODO: Update and verify once AWS Cognito is integrated
            <Button key='login' component={Link} href='/login'
                    className={cx(classes.headerLink, classes.header)}
                    sx={{ my: 2, color: 'white', display: 'block' }} >
              <Typography textAlign="center" className={cx(classes.header)}>
                Login
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
