import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { makeStyles, withStyles } from "tss-react/mui";
import ovoid from '../../resources/ovoid.jpg';
import { Link } from '@mui/material';
import { theme } from './theme';
import { SocialDistance } from '@mui/icons-material';

const useStyles = makeStyles()(
    (theme) => ({
       "header": 
       {
        marginBottom: '0', 
        paddingBottom: '0' 
       },
       "logo": 
       { 
         height: '32px',
         padding: theme.spacing(2),
       },
       "headerLink":
       {
        paddingBottom: '0',
        "&:hover":
        {
         borderBottomWidth: '7px',
         borderBottomStyle: 'solid',
         borderBottomColor: theme.palette.secondary.main,
        }
       },
    })
);

//TODO: page or link type
interface pageLink {
  name: string;
  address: string;
};

const pageMap: pageLink[] = [{ name: 'Dashboard', address: '/dashboard'}, /* /malsgm, /wilaayn't */
                             { name: 'Search',    address: '/gyiitsa'},
                             { name: 'Upload',    address: '/kyen'}];

//TODO: Profile Vs Acount (user info Vs authored Documents?)
const userMenuMap: pageLink[] = [{ name: 'Profile', address: '/waa'},
                                 { name: 'Account', address: '/xbiis'}, //box?
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
    <AppBar position="static" className={cx(classes.header)} >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
          <img src={ovoid} alt="logo" className={cx(classes.logo)}  />
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
            <Menu
              id="menu-appbar"
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
                  <Typography 
                     textAlign="center"
                     component="a"
                     href={address}>
                    {name} test
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
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
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
               className={cx(classes.header)} >
            {pageMap.map(({name, address}) => (
              <Button key={name} component={Link} href={address}
                      className={cx(classes.headerLink,classes.header)}
                      sx={{ my: 2, color: 'white', display: 'block' }} >
                <Typography textAlign="center" className={cx(classes.header)}>
                  {name}
                </Typography>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                  <Typography textAlign="center" component="a" href={address}>
                    {name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
