import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { InputAdornment, TextField } from '@mui/material';

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
import zIndex from '@mui/material/styles/zIndex';


const Search = styled('div')(({ theme }) => ({
  //position: 'relative',
  padding: 0,
  paddingBottom: '0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.50), },
  marginTop: 0,
  marginBottom: 0,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  //width: '100%',
  width: 'auto',
  //height: '2em',
  verticalAlign: 'baseline',
  /*
  [theme.breakpoints.up('sm')]: {
    //marginLeft: theme.spacing(3),
    width: 'auto',
  }, */
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  //padding: theme.spacing(2, 2),
  paddingBottom: '0',
  //height: '100%',  
  height: '28px',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  //display: 'inline-flex',
  verticalAlign: 'baseline',
  alignItems: 'left',
  justifyContent: 'left',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  display: 'inline-flex',
  //paddingBottom: '0',
  padding: '0',
  verticalAlign: 'baseline',
  borderRadius: theme.shape.borderRadius,
  //backgroundColor: theme.palette.secondary.main,
  //borderBottomWidth: '7px',
  //borderBottomStyle: 'solid',
  borderBottomColor: alpha(theme.palette.common.white, 0.25),
  '& .MuiInputBase-input': {
    /* padding: theme.spacing(1, 1, 1, 0), */
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '20ch',
    //[theme.breakpoints.up('md')]: { width: '20ch', },
  },
}));

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
        borderBottomColor: theme.palette.primary.main,
        "&:hover":
        { borderBottomColor: theme.palette.secondary.main, }
       },
       "headerSearch":
       {
         color: `${theme.palette.primary.contrastText} !important`,
         borderRadius: theme.shape.borderRadius,
         height: '70%',
         //alignContent: 'bottom',
         //marginTop: '0',
         //alignItems: 'middle',
         backgroundColor: alpha(theme.palette.common.white, 0.25),
         borderBottomColor: alpha(theme.palette.common.white, 0.0),
         "&:hover":
         { borderBottomColor: theme.palette.secondary.main, },
         "&:focus-within":
         { borderBottomColor: theme.palette.secondary.main, },
         "&:active":
         { borderBottomColor: theme.palette.secondary.main, },
         "& input": 
         { 
            color: theme.palette.primary.contrastText, 
            "&::placeholder": { opacity: 0.75 },
         },
         "& label": { 
            //using !important here feels like a dirty hack
            color: `${theme.palette.primary.contrastText} !important`, 
          },
       },
       "headerSearchIcon":
       {
         paddingBottom: '11px',
         paddingLeft: '.25em',
       },
       "searchField": 
       {
         color: theme.palette.primary.contrastText,
         display: 'inline-flex',
         //paddingBottom: '0',
         padding: '0',
         margin: 0,
         verticalAlign: 'baseline',
         borderRadius: theme.shape.borderRadius,
         //backgroundColor: theme.palette.secondary.main,
         //borderBottomWidth: '7px',
         //borderBottomStyle: 'solid',
         borderBottomColor: alpha(theme.palette.common.white, 0.25),
          /*
         '& .MuiInputBase-input': {
           padding: theme.spacing(1, 1, 1, 0),
           // vertical padding + font size from searchIcon
           paddingLeft: `calc(1em + ${theme.spacing(4)})`,
           transition: theme.transitions.create('width'),
           width: '20ch',
           //[theme.breakpoints.up('md')]: { width: '20ch', },
         }
         */
       }
    })
);

//TODO: extrace Type and Maps to another file

//page or link type
interface pageLink {
  name: string;
  address: string;
};

const pageMap: pageLink[] = [{ name: 'Dashboard', address: '/dashboard'}, /* /malsgm, /wilaayn't */
                             { name: 'Upload',    address: '/kyen'},
                             //leave search at the end.
                             { name: 'Search',    address: '/gyiitsa'}];

//TODO: Profile Vs Acount (user info vs authored Documents?)
const userMenuMap: pageLink[] = [{ name: 'Profile', address: '/waa'},
                                 //{ name: 'Account', address: '/xbiis'}, //box?
                                 { name: 'Logout',  address: '/kwdaxs'}];


const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => { setAnchorElNav(null); };

  const handleCloseUserMenu = () => { setAnchorElUser(null); };

  const { classes, cx } = useStyles();

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
                <MenuItem key={name} component={Link} href={address}>
                  <Typography textAlign="center" >
                    {name}
                  </Typography>
                </MenuItem>
              ))}
                <MenuItem>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </Search>
                </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} >
            <img src={ovoid} alt="logo" className={cx(classes.logo)} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
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
              <TextField variant='filled' placeholder='What are you looking for?'
                         className={cx(classes.headerLink, classes.header,
                                       classes.headerSearch)}
                         sx={{padding:0, }} 
                         InputProps={{ 'aria-label': 'search',
                                       startAdornment: (
                                        <InputAdornment position='start'>
                                          <SearchIcon className={cx(classes.headerSearchIcon)}
                                             sx={{ color: theme.palette.primary.contrastText}} />
                                        </InputAdornment>
                                       ),
                                       id: 'searchId',
                                       hiddenLabel: true,
                                       margin: 'dense',
                                       sx:{padding:0, }
                                       }} />
          </Box>
          
          {/* TODO: in AppBar Search */}
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
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};

export default ResponsiveAppBar;
