import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Close, ChatOutlined } from '@material-ui/icons';
import {
  AppBar,
  Dialog,
  Slide,
  Typography,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import { Chat } from './Chat';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  styledTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function ChatApp({ modalOpen, handleModal }) {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      modalOpen &&
      token &&
      user?._id &&
      !user?.companyId?._id &&
      !user?.employId?._id
    ) {
      handleModal();
    }
  }, [token, user]);

  return (
    <Dialog
      fullScreen
      open={modalOpen}
      onClose={handleModal}
      TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge='start'
            color='black'
            onClick={handleModal}
            aria-label='close'>
            <Close />
          </IconButton>
          <Typography variant='h5' className={classes.styledTitle}>
            <ChatOutlined color='primary' />
            &nbsp;<span>Chat</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <Chat />
    </Dialog>
  );
}
