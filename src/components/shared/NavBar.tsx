import React from 'react';
import { makeStyles, withStyles } from "tss-react/mui";
import { display, margin, padding, positions } from '@mui/system';
import { Link } from '@mui/material';
import { theme }  from './theme'

type Props = {
    className?: string;
};

const useStyles = makeStyles()(
    (theme) => ({
        "navbar":
        {
          width: '100%',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          position: 'fixed',
          top: '0px',
          //padding: '20px', //TODO: use spacing construct
          marginBottom: '10px' //TODO: spacing
        },
        "navLink":
        {
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          textDecoration: 'underline'
        }
    })
);

export default function NavBar() {

  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.navbar)}>
        {/* TODO: add a menu for dashboard */}
        <Link className={cx(classes.navLink)} href="/dashboard">Dashboard</Link> &nbsp;&nbsp;&nbsp; 
        TODO: Place a navbar here
    </div>
  );
}
