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
  FormControlLabel,
  FormLabel,
  RadioGroup,
  FormControl,
  Radio,
} from '@material-ui/core';
import { Close, AttachFile } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskById } from '../../actions/actionCreators/taskActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { Editor } from '@tinymce/tinymce-react';
import { makeStyles } from '@material-ui/core/styles';
import { uploadSubmissionAttachment } from '../../actions/actionCreators/uploadActions';
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
}));

export default function SubmitTask({ open, task, handleModal }) {
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({
    answer: '',
    oldAnswer: '',
    attachment: null,
    completed: 'false',
  });
  const { answer, attachment, completed, oldAnswer } = state;

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
    if (task?._id && user?._id) {
      let completed = false,
        answer = '',
        oldAnswer = '';

      task.user.map(
        (u) =>
          u.userId._id === user._id &&
          ((completed = u.completed ? 'true' : 'false'),
          (answer = u.submittedAnswer),
          (oldAnswer = u.submittedAnswer)),
      );

      setState({ ...state, completed, answer, oldAnswer });
    }
  }, [task, user]);

  const onTaskSubmit = async (e) => {
    e.preventDefault();

    const dateChose = new Date(task?.deadline).getTime();
    const dateNow = new Date().getTime();

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
      return dispatch(closeLoader());
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

    if (dateNow >= dateChose) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Your time is up, you cannot upload task now!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (!answer || answer === '<p><small>Enter answer for task</small></p>') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment) {
      // const url = `/api/file/uploadtasksubmissionattachments/${task?._id}`;
      const formData = new FormData();
      // config = {
      //   headers: {
      //     'content-type': 'multipart/form-data',
      //     'x-auth-token': token,
      //   },
      // };
      formData.append('file', attachment);

      // const res = await axios.post(url, formData, config);
      const res = await uploadSubmissionAttachment(task._id, formData, token);
      let array = task.user;

      if (res?.success && res?.filePath) {
        array.map(
          (u) =>
            u.userId._id === user._id &&
            ((u.submittedAnswer = answer),
            (u.submittedFile = res?.filePath),
            (u.completed = completed === 'true' ? true : false)),
        );
      } else if (res?.success && res?.imagePath) {
        array.map(
          (u) =>
            u.userId._id === user._id &&
            ((u.submittedAnswer = answer),
            (u.submittedImage = res?.imagePath),
            (u.completed = completed === 'true' ? true : false)),
        );
      } else if (res?.success && res?.videoPath) {
        array.map(
          (u) =>
            u.userId._id === user._id &&
            ((u.submittedAnswer = answer),
            (u.sumittedVideo = res?.videoPath),
            (u.completed = completed === 'true' ? true : false)),
        );
      }

      if (res?.success) {
        const data = {
          user: array,
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
          const assignees = [];

          task.user.map(
            (participant) =>
              participant.role === 'Editor' &&
              assignees.push({ userId: participant.userId._id }),
          );

          dispatch(
            postNotification(
              {
                title: 'Task Submitted',
                description: 'has just submitted their task!',
                companyId: user?.companyId?._id
                  ? user.companyId._id
                  : user?.employId?._id,
                from: user?._id,
                for: assignees,
              },
              token,
            ),
          );

          handleModal();
        }
      }
    } else {
      let array = task.user;

      array.map(
        (u) =>
          u.userId._id === user._id &&
          ((u.submittedAnswer = answer),
          (u.completed = completed === 'true' ? true : false)),
      );

      const data = {
        user: array,
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
        const assignees = [];

        task.user.map(
          (participant) =>
            participant.role === 'Editor' &&
            assignees.push({ userId: participant.userId._id }),
        );

        dispatch(
          postNotification(
            {
              title: 'Task Submitted',
              description: 'has just submitted a task!',
              companyId: user?.companyId?._id
                ? user.companyId._id
                : user?.employId?._id,
              from: user?._id,
              for: assignees,
            },
            token,
          ),
        );

        handleModal();
      }
    }
  };

  const onChange = (e) => {
    setState({ ...state, completed: e.target.value });
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
        <b>Submit Task</b>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Name: </b>
          {task?.name}
        </Typography>
        <br />
        <Typography gutterBottom style={{ display: 'inline-flex' }}>
          <b>Description:</b>&nbsp;
          <div
            dangerouslySetInnerHTML={{
              __html: `${task?.description}`,
            }}
          />
        </Typography>
        <br />
        <br />
        <Typography gutterBottom>
          <b>Deadline: </b>
          <span
            style={{
              color: '#51b300',
            }}>
            {new Date(task?.deadline).toLocaleString('en-US', {
              hour12: false,
            })}
          </span>
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Created At: </b>
          {new Date(task?.createdAt).toLocaleString('en-US', {
            hour12: false,
          })}
        </Typography>
        <br />
        <form onSubmit={onTaskSubmit}>
          <div>
            <Editor
              value={answer}
              initialValue={
                !oldAnswer && '<small>Enter answer for task</small>'
              }
              onBlur={(e) => {
                if (!answer && !oldAnswer) {
                  setState({
                    ...state,
                    answer: '<p><small>Enter answer for task</small></p>',
                  });
                }
              }}
              onFocus={(e) => {
                if (
                  !oldAnswer &&
                  answer === '<p><small>Enter answer for task</small></p>'
                ) {
                  setState({
                    ...state,
                    answer: '',
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
                  answer: content,
                });
              }}
            />
          </div>
          <br />
          <div>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Completed</FormLabel>
              <RadioGroup
                row
                aria-label='completed'
                name='completed'
                value={completed}
                onChange={onChange}>
                <FormControlLabel
                  value='true'
                  control={<Radio color='primary' />}
                  label='Yes'
                />
                <FormControlLabel
                  value='false'
                  control={<Radio color='primary' />}
                  label='No'
                />
              </RadioGroup>
            </FormControl>
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
            onClick={() => dispatch(openLoader({ open: true }))}
            autoFocus
            variant='contained'
            color='primary'
            size='small'>
            Submit
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
