import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  LinearProgress,
  withStyles,
  Divider,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  IconButton,
} from '@material-ui/core';
import {
  DeleteOutlined,
  AttachFile,
  CancelOutlined,
  EditOutlined,
  PublishOutlined,
  VisibilityOutlined,
} from '@material-ui/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import Countdown from 'react-countdown';
import RenderCheckbox from './RenderCheckbox';
import {
  createNewTask,
  updateTaskById,
  getTasksByCardId,
  deleteTaskById,
} from '../../actions/actionCreators/taskActions';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import EditTask from './EditTask';
import SubmitTask from './SubmitTask';
import ViewTask from './ViewTask';
import {
  uploadTaskAttachment,
  deleteTaskAttachment,
} from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  progressBarRoot: {
    flexGrow: 1,
  },
  checkboxes: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameAndButton: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonRight: {
    float: 'right',
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

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

export default function Task({ currentBoard, task, updateComponent }) {
  const classes = useStyles();
  const { tasks } = useSelector((state) => state.tasks);
  const { token, user } = useSelector((state) => state.user);
  const [disabled, setDisabled] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  // const [tasksAdmin, setTasksAdmin] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [participants, setParticipants] = useState([]);
  const dispatch = useDispatch();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [state, setState] = useState({
    progress: 0,
    attachment: null,
    deadline: '',
    description: '',
    taskName: '',
  });
  const { description, progress, deadline, taskName, attachment } = state;

  useEffect(() => {
    if (task?._id && token) {
      dispatch(getTasksByCardId(task._id, token));
    }
  }, [task, token]);

  useEffect(() => {
    if (task?.user?.length > 0) {
      let array = task.user.filter((t) => t.userId._id !== user._id);

      setFilteredUsers(array);
    }
  }, [task, user]);

  useEffect(() => {
    if (tasks?.length > 0) {
      let today = new Date();
      let disable = [];

      for (let i = 0; i < tasks.length; i++) {
        let deadline = new Date(tasks[i].deadline);

        if (today?.getTime() >= deadline.getTime()) {
          disable.push(true);
        } else {
          disable.push(false);
        }
      }

      setDisabled(disable);
      disable = [];
    }
  }, [tasks]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [token]);

  const getResponse = () => {
    if (tasks.length > 0) {
      let checked = 0,
        percentage = 0;

      tasks.map((check) => {
        return check.checked ? checked++ : null;
      });

      percentage = (checked / tasks.length) * 100;

      setState({
        ...state,
        progress: percentage,
      });
    }
  };

  useEffect(() => {
    getResponse();
  }, [tasks]);

  const Completed = ({ index }) => {
    return <span>Times Up!</span>;
  };

  const renderer = ({ index, days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completed index={index} />;
    } else {
      return (
        <span>
          <b>D: </b>
          {days} <b>H: </b>
          {hours} <b>M: </b>
          {minutes} <b>S: </b>
          {seconds}
        </span>
      );
    }
  };

  const handleModalEdit = () => {
    setOpenEdit(!openEdit);
  };

  const updateCheckbox = async (taskId, data) => {
    const res = await dispatch(updateTaskById(taskId, data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) updateComponent();
  };

  const onTaskDelete = async () => {
    const res = await dispatch(deleteTaskById(selectedTask._id, token));
    deleteTaskAttachment(selectedTask._id, currentBoard._id, task._id, token);

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    handleDialogClose();

    if (res?.success) updateComponent();
  };

  const renderCheckboxes = () => {
    return tasks.map((task, index) => {
      let deadlineDate = new Date(task?.deadline).getTime();

      return (
        <div key={index} className={classes.checkboxes}>
          <div className={classes.nameAndButton}>
            <RenderCheckbox
              index={index}
              id={task?._id}
              name={task?.name}
              disabled={disabled[index]}
              checked={task?.checked}
              onChange={updateCheckbox}
            />
            <IconButton
              aria-label='visibility'
              color='primary'
              onClick={() => {
                setSelectedTask(task);
                handleModalInfo();
              }}>
              <VisibilityOutlined />
            </IconButton>
            {task?.user?.length > 0 &&
              task.user.map(
                (u) =>
                  u.userId._id === user._id &&
                  u.role === 'Editor' && (
                    <>
                      <IconButton
                        aria-label='delete'
                        color='primary'
                        onClick={() => handleDialogOpen(task)}>
                        <DeleteOutlined />
                      </IconButton>
                      <IconButton
                        aria-label='edit'
                        color='primary'
                        onClick={() => {
                          setSelectedTask(task);
                          handleModalEdit();
                        }}>
                        <EditOutlined />
                      </IconButton>
                    </>
                  ),
              )}
            {task?.user?.length > 0 &&
              task.user.map(
                (u) =>
                  u.userId._id === user._id &&
                  u.role === 'Viewer' && (
                    <IconButton
                      aria-label='publish'
                      color='primary'
                      disabled={
                        new Date().getTime() >
                        new Date(task?.deadline).getTime()
                          ? true
                          : false
                      }
                      onClick={() => {
                        setSelectedTask(task);
                        handleModalSubmit();
                      }}>
                      <PublishOutlined />
                    </IconButton>
                  ),
              )}
          </div>
          <Countdown
            key={index}
            date={deadlineDate}
            renderer={(props) => renderer({ index, ...props })}
          />
        </div>
      );
    });
  };

  const onTaskCreate = async (e) => {
    e.preventDefault();

    const dateChose = new Date(deadline).getTime();
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
          message: 'Choose correct Date and Time!',
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
        assignees.push({ userId: participant.userId._id, role: 'Viewer' }),
      );
    }

    const data = {
      name: taskName,
      deadline,
      cardId: task._id,
      description,
      companyId: user?.companyId ? user.companyId : user?.employId,
      user: assignees,
    };
    const res = await dispatch(createNewTask(data, token));

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

      // const response = await axios.post(url, formData, config);
      const response = await uploadTaskAttachment(
        res?.task?._id,
        formData,
        token,
      );

      if (!response?.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        return dispatch(closeLoader());
      }
    }

    setState({
      ...state,
      taskName: '',
      deadline: '',
      description: '',
      attachment: null,
    });

    res?.success && updateComponent();

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

      participants.map(
        (participant) =>
          participant.userId._id != user._id &&
          assignees.push({ userId: participant.userId._id }),
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

  const handleDialogOpen = (data) => {
    setSelectedTask(data);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedTask('');
    setOpenDialog(false);
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onAttachmentUpload = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const handleModalInfo = () => {
    setOpenInfo(!openInfo);
  };

  const handleModalSubmit = () => {
    setOpenSubmit(!openSubmit);
  };

  return (
    <>
      <EditTask
        handleModal={handleModalEdit}
        task={selectedTask}
        open={openEdit}
      />
      <SubmitTask
        handleModal={handleModalSubmit}
        task={selectedTask}
        open={openSubmit}
      />
      <ViewTask
        handleModal={handleModalInfo}
        task={selectedTask}
        open={openInfo}
      />
      <Typography variant='h6'>Task List</Typography>
      <Box className={classes.progressBarRoot}>
        <BorderLinearProgress variant='determinate' value={progress} />
      </Box>
      {renderCheckboxes()}
      <Divider />
      <form className={classes.spacing} onSubmit={onTaskCreate}>
        <div>
          <TextField
            label='Task Name'
            name='taskName'
            value={taskName}
            onChange={onChange}
            fullWidth
            variant='outlined'
          />
        </div>
        <br />
        <div>
          <Editor
            value={description}
            initialValue={'<small>Enter description for task</small>'}
            onBlur={(e) => {
              if (description === '') {
                setState({
                  ...state,
                  description:
                    '<p><small>Enter description for task</small></p>',
                });
              }
            }}
            onFocus={(e) => {
              if (
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
        <div>
          <Autocomplete
            multiple
            id='tags-standard'
            options={filteredUsers}
            getOptionLabel={(option) =>
              option.userId.firstName + ' ' + option.userId.lastName
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
        {!openEdit && (
          <>
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
          </>
        )}
        <br />
        <div>
          <Button
            onClick={() => dispatch(openLoader({ open: true }))}
            type='submit'
            size='small'
            variant='contained'
            color='primary'
            className={classes.buttonRight}>
            Create
          </Button>
        </div>
      </form>
      <br />
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Delete task permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={handleDialogClose}
            startIcon={<CancelOutlined />}
            size='small'>
            No
          </Button>
          <Button
            startIcon={<DeleteOutlined />}
            onClick={() => {
              dispatch(openLoader({ open: true }));
              onTaskDelete();
            }}
            variant='contained'
            color='primary'
            size='small'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
