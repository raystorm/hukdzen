import React, { useState} from 'react';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {useAppDispatch, useAppSelector} from "../../app/hooks";

import {menuLinkItem, useStyles} from "./ResponsiveAppBar";

interface AppBarMenuProps {
   prefix: string;
   name: string;
   items: menuLinkItem[];
   isNested?: boolean;
}

/**
 *  Helper class to simplify UI handling for Menus/Submenus in the AppBar
 *  @param prefix - Prefix for the menu
 *  @param name - Menu Name
 *  @param items - Items in the menu
 *  @constructor
 */
const AppBarMenu = ({prefix, name, items, isNested = false}: AppBarMenuProps) =>
{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
  {
     if (isNested)
     {
        event.stopPropagation();
        event.preventDefault();
     }
     setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleHover = (event: React.MouseEvent<HTMLElement>) =>
  {
     if (isNested && !anchorEl) { setAnchorEl(event.currentTarget); }
  };

  const handleMenuMouseLeave = () =>
  {
     if (isNested) { setAnchorEl(null); }
  };

  const openEl = Boolean(anchorEl);

  const handleClose = () => { setAnchorEl(null); };

  const { classes: css, cx } = useStyles();

  //console.log("AppBarMenu", name, items);

  /* SubMenu for AppBar */
  return (
       <>
         {!isNested ? (
         <Button onClick={handleClick}
                 aria-controls={openEl ? `${name}-menu` : undefined}
                 aria-expanded={openEl ? 'true' : undefined}
                 aria-haspopup="true"
                 className={cx(css.headerLink, css.header)}
                 sx={{ my: 2, color: 'white', display: 'block' }}
         >
            <Typography textAlign="center" className={cx(css.header)}>
               {name}
            </Typography>
         </Button>
         ) : (
         <MenuItem onClick={handleClick}
                   onMouseEnter={handleHover}
                   aria-controls={openEl ? `${name}-menu` : undefined}
                   aria-expanded={openEl ? 'true' : undefined}
                   aria-haspopup="true"
         >
            <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
            <ChevronRightIcon fontSize="small" />
         </MenuItem>
         )}
         <Menu id={`${prefix}-${name}-submenu`} anchorEl={anchorEl} open={openEl}
               onClose={handleClose} keepMounted
               MenuListProps={isNested ? { onMouseLeave: handleMenuMouseLeave } : undefined}
               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
               transformOrigin={{ vertical: 'top', horizontal: 'left' }}
         >
           {items.map(item =>
              !item.subMenu ?
              <MenuItem key={`sm-${prefix}-${name}-${item.name}`}
                        component={Link} href={item.path}>
                <Typography>{item.name}</Typography>
              </MenuItem>
              :
              <AppBarMenu key={`sm-${prefix}-${name}-${item.name}`}
                          prefix={`${prefix}-${name}`} name={item.name}
                          items={item.subMenu} isNested />
           )}
         </Menu>
       </>
  );
};

export default AppBarMenu;
