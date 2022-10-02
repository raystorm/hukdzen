import React from 'react';
import { makeStyles, withStyles } from "tss-react/mui";
import { display, margin, padding, positions } from '@mui/system';
import { Link } from '@mui/material';

type Props = {
    className?: string;
};

const useStyles = makeStyles()(
    (theme) => ({
        "navbar":
        {
          width: '100%',
          backgroundColor: '#ff8c00',
          color: '#FFFFFF',
          fontWeight: 'bold',
          position: 'fixed',
          top: '0px',
          //padding: '20px', //TODO: use spacing construct
          marginBottom: '10px' //TODO: spacing
        }
    })
);

export default function NavBar() {

  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.navbar)}>
        {/* TODO: add a menu for dashboard */}
        <Link href="/dashboard">Dashboard</Link> &nbsp;&nbsp;&nbsp; 
        TODO: Place a navbar here
    </div>
  );
}
