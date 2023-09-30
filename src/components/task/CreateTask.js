import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  InputLabel,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { AttachFile } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { createNewTask } from '../../actions/actionCreators/taskActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { uploadTaskAttachment } from '../../actions/actionCreators/uploadActions';
import { Editor } from '@tinymce/tinymce-react';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  parentDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px',
  },
  styledCard: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('md')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0px',
    },
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
  file: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
}));

export default function CreateTask({ handleChangeIndex }) {
  const { token, user, companyUsers } = useSelector((state) => state.user);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [description, setDescription] = useState('');
  const [state, setState] = useState({
    deadline: '',
    attachment: null,
    taskName: '',
  });
  const { deadline, taskName, attachment } = state;

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
  }, [companyUsers, user]);

  const onTaskCreate = async (e) => {
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

    if (attachment?.size / 1024 / 1024 > 5) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Image/File/GIF/Video!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      !taskName ||
      !deadline ||
      participants.length === 0 ||
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
      return dispatch(closeLoader());
    }

    const assignees = [
      {
        userId: user._id,
        role: 'Editor',
      },
    ];

    if (participants.length > 0) {
      participants.map((participant) =>
        assignees.push({ userId: participant._id, role: 'Viewer' }),
      );
    }

    const data = {
      name: taskName,
      deadline,
      description,
      companyId: user?.companyId ? user.companyId : user?.employId,
      user: assignees,
    };
    const res = await dispatch(createNewTask(data, token));

    if (res?.success) {
      if (attachment) {
        // const url = `/api/file/uploadtaskattachment/${res?.task?._id}`,
        const formData = new FormData();
        // config = {
        //   headers: {
        //     'content-type': 'multipart/form-data',
        //     'x-auth-token': token,
        //   },
        // };
        formData.append('file', attachment);

        // const response_2 = await axios.post(url, formData, config);
        const response_2 = await uploadTaskAttachment(
          res?.task?._id,
          formData,
          token,
        );

        if (response_2?.success) {
          dispatch(
            openSnackbar({
              open: true,
              message: res?.message,
              severity: res?.success,
            }),
          );
          dispatch(closeLoader());
          handleChangeIndex(0);
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: response_2?.message,
              severity: response_2?.success,
            }),
          );
          dispatch(closeLoader());
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());
        handleChangeIndex(0);
      }

      setState({ ...state, taskName: '', deadline: '' });

      const assignees = [];

      participants.map(
        (participant) =>
          participant._id != user._id &&
          assignees.push({ userId: participant._id }),
      );

      dispatch(
        postNotification(
          {
            title: 'Task Assigned',
            description: 'has just assigned you a task!',
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
    <div className={classes.parentDiv}>
      <Card className={classes.styledCard}>
        <CardContent>
          <Typography
            variant='h4'
            color='textPrimary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Create a Task
          </Typography>
          <form onSubmit={onTaskCreate}>
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
            <div>
              <Editor
                value={description}
                initialValue={'<small>Enter description for task</small>'}
                onBlur={(e) => {
                  if (description === '') {
                    setDescription(
                      '<p><small>Enter description for task</small></p>',
                    );
                  }
                }}
                onFocus={(e) => {
                  if (
                    description ===
                    '<p><small>Enter description for task</small></p>'
                  ) {
                    setDescription('');
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
                  setDescription(content);
                }}
              />
            </div>
            <br />
            <Typography color='textPrimary' variant='h6'>
              Upload Image/File/GIF/Video
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
              name='file'
              onChange={onAttachmentUpload}
            />
            <br />
            <div>
              <Autocomplete
                multiple
                id='tags-standard'
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
                    label='Users'
                    fullWidth
                    placeholder='Select user'
                  />
                )}
              />
            </div>
            <br />
            <Button
              type='submit'
              autoFocus
              onClick={() => dispatch(openLoader({ open: true }))}
              variant='contained'
              style={{ float: 'right' }}
              color='primary'
              size='small'>
              Create
            </Button>
            <br />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
