import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Close } from '@material-ui/icons';
import { updateCompany } from '../../actions/actionCreators/companyActions';
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

export default function EditCompany({ open, company, handleModal }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phoneNumber: e.target.phoneNumber.value,
    };

    const res = await dispatch(updateCompany(company._id, data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

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
          Company Information
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent
            dividers
            className={classes.root}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div>
              <TextField
                label='Name'
                name='name'
                fullWidth
                required
                defaultValue={company?.name}
                variant='outlined'
              />
            </div>
            <div>
              <TextField
                label='Email'
                fullWidth
                required
                type='email'
                name='email'
                defaultValue={company?.email}
                variant='outlined'
              />
            </div>
            <div>
              <TextField
                label='Phone Number'
                fullWidth
                name='phoneNumber'
                required
                defaultValue={company?.phoneNumber}
                variant='outlined'
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              type='submit'
              color='primary'
              variant='contained'
              className={classes.floatRight}
              size='small'>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
