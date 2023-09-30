import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Close, AttachFile } from '@material-ui/icons';
import {
  DialogTitle as MuiDialogTitle,
  TextField,
  Typography,
  Button,
  Dialog,
  IconButton,
  InputLabel,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { createGroup } from '../../actions/actionCreators/chatActions';
import { makeStyles } from '@material-ui/core/styles';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import Loader from '../Utilities/Loader';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';
import { uploadGroupProfilePicture } from '../../actions/actionCreators/uploadActions';

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

const useStyles = makeStyles((theme) => ({
  styledForm: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50ch',
    },
  },
  file: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
  label: {
    cursor: 'pointer',
    border: '2px solid #183569',
    color: '#183569',
    width: 'fit-content',
    padding: '5px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#183569',
      color: '#ffffff',
    },
  },
}));

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

export default function CreateGroup({ open, handleModal }) {
  const classes = useStyles();
  const { token, user, companyUsers } = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const [state, setState] = useState({ attachment: '' });
  const { attachment } = state;

  const getUsers = async () => {
    if (user?.employId?._id) {
      dispatch(getAllUsersByEmployId(user.employId._id, token));
    }

    if (user?.companyId?._id) {
      dispatch(getAllUsersByEmployId(user.companyId._id, token));
    }
  };

  useEffect(() => {
    getUsers();
  }, [token, user]);

  useEffect(() => {
    if (companyUsers.length > 0) {
      let array = companyUsers.filter((u) => u._id !== user._id);

      setFilteredUsers(array);
    }
  }, [companyUsers]);

  const onCreate = async (e) => {
    e.preventDefault();

    if (participants.length === 0 || !name) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    let array = [];

    participants.map((participant) => array.push(participant._id));
    array.push(user._id);

    const data = {
      from: user._id,
      name,
      createdBy: user._id,
      participants: array,
    };
    const res = await dispatch(createGroup(data, token));

    if (res?.success) {
      if (attachment) {
        const formData = new FormData();

        formData.append('file', attachment);

        uploadGroupProfilePicture(res?.group?._id, formData, token);
      }

      const assignees = [];

      participants.map(
        (p) => p?._id != user?._id && assignees.push({ userId: p?._id }),
      );

      dispatch(
        postNotification(
          {
            title: 'Added in a Group',
            description: 'has just added you in a group!',
            companyId: user?.companyId?._id
              ? user.companyId._id
              : user?.employId?._id,
            from: user?._id,
            for: assignees,
          },
          token,
        ),
      );

      setParticipants([]);
      handleModal();
    }

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onAttachmentUpload = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}>
      {loader ? <Loader open={loader} /> : null}
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        Create Group
      </DialogTitle>
      <form
        className={classes.styledForm}
        noValidate
        autoComplete='off'
        onSubmit={onCreate}>
        <DialogContent dividers>
          <TextField
            variant='outlined'
            label='Group Name'
            value={name}
            size='small'
            onChange={onNameChange}
            fullWidth
          />
          <br />
          <br />
          <Autocomplete
            multiple
            size='small'
            options={filteredUsers}
            getOptionLabel={(option) =>
              option.firstName + ' ' + option.lastName
            }
            onChange={(e, option) => {
              setParticipants(option);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Group Members'
                placeholder='Enter group members'
              />
            )}
          />
          <br />
          <Typography color='textPrimary' variant='h6'>
            Upload Image/GIF
          </Typography>
          <InputLabel className={classes.label} htmlFor='file'>
            Choose File
            <AttachFile />
          </InputLabel>
          <Typography variant='caption'>{attachment?.name}</Typography>
          <TextField
            className={classes.file}
            type='file'
            id='file'
            size='small'
            name='file'
            onChange={onAttachmentUpload}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type='submit'
            autoFocus
            size='small'
            variant='contained'
            color='primary'
            onClick={() => dispatch(openLoader({ open: true }))}>
            Create Group
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
