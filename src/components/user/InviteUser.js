import React, { useRef, useState, useEffect } from 'react';
import {
  makeStyles,
  IconButton,
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { Close } from '@material-ui/icons';
import Email from '../features/Email';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';

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

export default function InviteUser({ modalOpen, handleModal }) {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const descriptionElementRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [token]);

  return (
    <Dialog
      maxWidth={'xs'}
      maxHeight={'xs'}
      open={modalOpen}
      onClose={handleModal}
      scroll='paper'
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'>
      <DialogTitle id='scroll-dialog-title'>
        <>
          <IconButton
            size='small'
            className={classes.close}
            onClick={handleModal}>
            <Close fontSize='small' />
          </IconButton>
          <Typography variant='h6'>Invite User</Typography>
        </>
      </DialogTitle>
      <DialogContent dividers='paper'>
        <DialogContentText
          id='scroll-dialog-description'
          ref={descriptionElementRef}
          tabIndex={-1}>
          <Email />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
