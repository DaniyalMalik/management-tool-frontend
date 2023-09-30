import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Close, BusinessOutlined } from '@material-ui/icons';
import {
  AppBar,
  Dialog,
  Slide,
  Typography,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import CompanyDashboard from './CompanyDashboard';
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

export default function CompanyModal({ open, closeModal }) {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      open &&
      token &&
      user?._id &&
      user?.companyId?._id &&
      user?.employId?._id
    ) {
      closeModal();
    }
  }, [token, user]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={closeModal}
      TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge='start'
            color='black'
            onClick={closeModal}
            aria-label='close'>
            <Close />
          </IconButton>
          <Typography variant='h5' className={classes.styledTitle}>
            <BusinessOutlined color='primary' fontSize='large' />
            &nbsp;<span>Create Company</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <CompanyDashboard />
    </Dialog>
  );
}
