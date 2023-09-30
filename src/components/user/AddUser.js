import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import {
  addUser,
  fetchUserInfo,
} from '../../actions/actionCreators/userActions';
import { Close } from '@material-ui/icons';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 500,
    },
  },
}));

export default function AddUser({ open, handleModal, handleRefresh }) {
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (token) dispatch(fetchUserInfo(token));
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      passwordCheck: e.target.passwordCheck.value,
      employId: e.target.employId.value,
    };
    const res = await dispatch(addUser(data));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    handleRefresh();
    handleModal();
  };

  return (
    <div>
      <Dialog
        onClose={handleModal}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth>
        <DialogTitle id='customized-dialog-title' onClose={handleModal}>
          Add User
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent
            className={classes.root}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextField
              label='First Name'
              fullWidth
              name='firstName'
              required
              variant='outlined'
            />
            <TextField
              label='Last Name'
              fullWidth
              name='lastName'
              required
              variant='outlined'
            />
            <TextField
              label='Email'
              type='email'
              fullWidth
              name='email'
              required
              variant='outlined'
            />
            <TextField
              label='Password'
              fullWidth
              required
              type='password'
              name='password'
              variant='outlined'
            />
            <TextField
              label='Repeat Password'
              type='password'
              fullWidth
              required
              name='passwordCheck'
              variant='outlined'
            />
            <TextField
              label='Employ Id'
              fullWidth
              disabled
              name='employId'
              defaultValue={user?.companyId?._id}
              variant='outlined'
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant='contained'
              type='submit'
              onClick={() => dispatch(openLoader({ open: true }))}
              color='primary'
              size='small'>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
