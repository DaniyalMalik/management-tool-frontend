import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  IconButton,
  DialogActions as MuiDialogActions,
  InputLabel,
} from '@material-ui/core';
import { Close, AttachFile } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskById } from '../../actions/actionCreators/taskActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { Editor } from '@tinymce/tinymce-react';
import { makeStyles } from '@material-ui/core/styles';
import { uploadTaskAttachment } from '../../actions/actionCreators/uploadActions';
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
  file: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
  floatRight: {
    float: 'right',
  },
}));

export default function EditTask({ open, task, handleModal }) {
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({
    deadline: '',
    description: '',
    attachment: null,
    taskName: '',
  });
  const { deadline, taskName, description, attachment } = state;

  useEffect(() => {
    if (task) {
      setState({
        ...state,
        taskName: task?.name,
        deadline: task?.deadline,
        completed: task?.checked === true ? 'true' : 'false',
        description: task?.description,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

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

  const onTaskUpdate = async (e) => {
    e.preventDefault();

    const dateChose = new Date(deadline).getTime();
    const dateNow = new Date().getTime();

    if (dateNow >= dateChose) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Choose correct Date and Time!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] !== 'video' &&
      attachment?.type.split('/')[0] !== 'image' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large File!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'image' &&
      attachment?.size / 1024 / 1024 > 20
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Image/GIF!',
          severity: false,
        }),
      );
      dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'video' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Video!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      !taskName ||
      !deadline ||
      !description ||
      description === '<p><small>Enter description for task</small></p>'
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      dispatch(closeLoader());
    }

    if (attachment) {
      // const url = `/api/file/uploadtaskattachment/${task?._id}`,
      const formData = new FormData();
      // config = {
      //   headers: {
      //     'content-type': 'multipart/form-data',
      //     'x-auth-token': token,
      //   },
      // };
      formData.append('file', attachment);

      // const response_2 = await axios.post(url, formData, config);
      const response_2 = await uploadTaskAttachment(task?._id, formData, token);
      if (response_2?.success) {
        const data = {
          name: taskName,
          description,
          deadline,
        };
        const res = await dispatch(updateTaskById(task._id, data, token));

        if (res?.success) {
          dispatch(
            openSnackbar({
              open: true,
              message: res?.message,
              severity: res?.success,
            }),
          );
          dispatch(closeLoader());

          handleModal();
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: res?.message,
              severity: res?.success,
            }),
          );
          dispatch(closeLoader());
        }

        const assignees = [];

        task.user.map(
          (participant) =>
            participant.userId._id != user._id &&
            assignees.push({ userId: participant.userId._id }),
        );

        dispatch(
          postNotification(
            {
              title: 'Task Updated',
              description: 'has just updated your task!',
              companyId: user?.companyId?._id
                ? user.companyId._id
                : user?.employId?._id,
              from: user?._id,
              for: assignees,
            },
            token,
          ),
        );
      }
    } else {
      const data = {
        name: taskName,
        description,
        deadline,
      };
      const res = await dispatch(updateTaskById(task._id, data, token));

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());

      if (res?.success) {
        handleModal();
      }

      const assignees = [];

      task.user.map(
        (participant) =>
          participant.userId._id != user._id &&
          assignees.push({ userId: participant.userId._id }),
      );

      dispatch(
        postNotification(
          {
            title: 'Task Updated',
            description: 'has just updated your task!',
            companyId: user?.companyId?._id
              ? user.companyId._id
              : user?.employId?._id,
            from: user?._id,
            for: assignees,
          },
          token,
        ),
      );
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onAttachmentUpload = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        <b>Edit Task</b>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={onTaskUpdate}>
          <div>
            <TextField
              label='Task Name'
              name='taskName'
              value={taskName}
              onChange={onChange}
              variant='outlined'
              fullWidth
            />
          </div>
          <br />
          <div>
            <Editor
              value={description}
              initialValue={
                !task?.description &&
                '<small>Enter description for task</small>'
              }
              onBlur={(e) => {
                if (!description && !task?.description) {
                  setState({
                    ...state,
                    description:
                      '<p><small>Enter description for task</small></p>',
                  });
                }
              }}
              onFocus={(e) => {
                if (
                  !task?.description &&
                  description ===
                    '<p><small>Enter description for task</small></p>'
                ) {
                  setState({
                    ...state,
                    description: '',
                  });
                }
              }}
              init={{
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
              onEditorChange={(content) => {
                setState({
                  ...state,
                  description: content,
                });
              }}
            />
          </div>
          <br />
          <div>
            <TextField
              label='Deadline'
              fullWidth
              variant='outlined'
              name='deadline'
              value={deadline}
              onChange={onChange}
              type='datetime-local'
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <br />
          <Typography variant='h6'>Upload Image/File/GIF/Video</Typography>
          <InputLabel className={classes.label} htmlFor='file'>
            Choose File
            <AttachFile />
          </InputLabel>
          <Typography variant='caption'>{attachment?.name}</Typography>
          <TextField
            className={classes.file}
            type='file'
            id='file'
            name='file'
            onChange={onAttachmentUpload}
          />
          <br />
          <Button
            type='submit'
            autoFocus
            variant='contained'
            onClick={() => dispatch(openLoader({ open: true }))}
            className={classes.floatRight}
            color='primary'
            size='small'>
            Update
          </Button>
        </form>
      </DialogContent>
      {/* <DialogActions>
        <Button
          autoFocus
          variant='contained'
          size='small'
          onClick={handleModal}
          color='primary'>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
