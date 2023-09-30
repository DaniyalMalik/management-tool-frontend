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

export default function Company({ open, company, handleModal }) {
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
        <DialogContent dividers>
          <Typography gutterBottom>
            <b>Name: </b>
            {company?.name}
          </Typography>
          <Typography gutterBottom>
            <b>Email: </b>
            {company?.email}
          </Typography>
          <Typography gutterBottom>
            <b>Phone Number: </b>
            {company?.phoneNumber}
          </Typography>
          <Typography gutterBottom>
            <b>Attachments Size : </b>
            {(company?.attachmentsSize / 1024 / 1024).toFixed(4)}
            &nbsp;<b>MB</b>
          </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button
            autoFocus
            size='small'
            variant='contained'
            onClick={handleModal}
            color='primary'>
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
