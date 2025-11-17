import React, { useState} from 'react';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';

import {useAppDispatch, useAppSelector} from "../../app/hooks";

import {menuLinkItem, useStyles} from "./ResponsiveAppBar";

interface AppBarMenuProps {
   name: string;
   items: menuLinkItem[];
}


/**
 *  Helper class to simplify UI handling for Menus/Submenus in the AppBar
 *  (WideScreen)
 *  @param name - Menu Name
 *  @param items - Items in the menu
 *  @constructor
 */
const AppBarMenu = ({name, items}: AppBarMenuProps) =>
{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl,   setAnchorEl]   = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
  { setAnchorEl(event.currentTarget); };

  const openEl = Boolean(anchorEl);

  const handleClose   = () => { setAnchorEl(null); };

  const { classes: css, cx } = useStyles();

  console.log("AppBarMenu", name, items);

  /* Header Tabs for Widescreen */
  return (
       <>
         <Button onClick={handleOpen}
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
         <Menu id={`${name}-menu`}
               anchorEl={anchorEl} open={openEl}
               onClose={handleClose}
         >
           {items.map(item =>
              <MenuItem key={`wide-${item.name}`}
                        component={Link} href={item.path}>
                <Typography textAlign="center" >{item.name}</Typography>
              </MenuItem>
           )}
         </Menu>
       </>
  );
};

export default AppBarMenu;
