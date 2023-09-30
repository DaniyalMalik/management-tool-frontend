import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

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

export default function User({ open, user, handleModal }) {
  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        User Information
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Full Name: </b>
          {user?.firstName + ' ' + user?.lastName}
        </Typography>
        <Typography gutterBottom>
          <b>Email: </b>
          {user?.email}
        </Typography>
        <Typography gutterBottom>
          <b>Phone Number: </b>
          {user?.phoneNumber}
        </Typography>
        <Typography gutterBottom>
          <b>Attachments Size : </b>
          {(user?.attachmentsSize / 1024 / 1024).toFixed(4)}
          &nbsp;<b>MB</b>
        </Typography>
      </DialogContent>
      {/* <DialogActions>
        <Button
          autoFocus
          variant='contained'
          onClick={handleModal}
          size='small'
          color='primary'>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
