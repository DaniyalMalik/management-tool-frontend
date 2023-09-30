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
import { updateUser } from '../../actions/actionCreators/userActions';
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
  floatRight: {
    float: 'right',
  },
}));

export default function EditUser({ open, user, handleModal }) {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const { email, firstName, lastName, phoneNumber } = state;

  useEffect(() => {
    if (user?._id)
      setState({
        ...state,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        phoneNumber: user?.phoneNumber,
      });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };
    const res = await dispatch(updateUser(user._id, data, token));

    if (res?.success) handleModal();

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Dialog
        onClose={handleModal}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth>
        <DialogTitle id='customized-dialog-title' onClose={handleModal}>
          User Information
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
              onChange={onChange}
              value={firstName}
              variant='outlined'
            />
            <TextField
              label='Last Name'
              fullWidth
              name='lastName'
              onChange={onChange}
              required
              value={lastName}
              variant='outlined'
            />
            <TextField
              label='Email'
              type='email'
              fullWidth
              name='email'
              required
              onChange={onChange}
              disabled
              value={email}
              variant='outlined'
            />
            <TextField
              label='Phone Number'
              fullWidth
              onChange={onChange}
              name='phoneNumber'
              value={phoneNumber}
              variant='outlined'
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant='contained'
              className={classes.floatRight}
              type='submit'
              onClick={() => dispatch(openLoader({ open: true }))}
              color='primary'
              size='small'>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
