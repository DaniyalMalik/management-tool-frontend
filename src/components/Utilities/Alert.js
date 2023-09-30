import React, { useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  scrollButtonBar: {
    padding: '20px',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    minWidth: '100%',
  },
  close: {
    color: theme.palette.grey[500],
    float: 'right',
  },
  description: {
    display: 'flex',
    justifuyContent: 'flexStart',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
}));

export default function Alert({ open, alert, message, handleAlert }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleAlert}>
      <DialogTitle>
        {alert}
        <IconButton
          size='small'
          className={classes.close}
          onClick={handleAlert}>
          <Close fontSize='small' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          size='small'
          onClick={handleAlert}
          variant='contained'
          color='primary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
