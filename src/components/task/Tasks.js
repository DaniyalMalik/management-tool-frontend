import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  TableRow,
  TableHead,
  TableContainer,
  Box,
  TableBody,
  Table,
  Typography,
  Popover,
  Avatar,
  LinearProgress,
  Paper,
  TableCell,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Tooltip,
  DialogActions,
  Dialog,
} from '@material-ui/core';
import {
  DeleteOutlined,
  VisibilityOutlined,
  PublishOutlined,
  CancelOutlined,
  EditOutlined,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTasksByUserId,
  deleteTaskById,
} from '../../actions/actionCreators/taskActions';
import { deleteTaskAttachment } from '../../actions/actionCreators/uploadActions';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import ViewTask from './ViewTask';
import EditTask from './EditTask';
import SubmitTask from './SubmitTask';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  display: {
    display: 'flex',
    justifyContent: 'center',
  },
  progressBarRoot: {
    flexGrow: 1,
    width: '100%',
  },
  styledPaper: {
    width: '70vw',
  },
  styledTableContainer: {
    maxHeight: '500px',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box display='flex' alignItems='center'>
      <Box width='100%' mr={1}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant='body2' color='textSecondary'>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

export default function Tasks() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.tasks);
  const [selectedTask, setSelectedTask] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleModalEdit = () => {
    setOpenEdit(!openEdit);
  };

  const handleModalSubmit = () => {
    setOpenSubmit(!openSubmit);
  };

  const handleModalInfo = () => {
    setOpenInfo(!openInfo);
  };

  const getResponse = () => {
    if (token) dispatch(getTasksByUserId(token));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = (item) => {
    setOpenDialog(true);
    setSelectedTask(item);
  };

  useEffect(() => {
    getResponse();
  }, [token]);

  const updateProgress = () => {
    let checked = 0,
      percentage = 0;

    tasks.map((task) =>
      task.user.map(
        (taskUser) =>
          taskUser?.userId?._id === user?._id &&
          taskUser.role === 'Viewer' &&
          taskUser.completed &&
          checked++,
      ),
    );

    percentage = (checked / tasks.length) * 100;

    setProgress(percentage);
  };

  useEffect(() => {
    if (tasks?.length > 0) updateProgress();
  }, [tasks]);

  const onDeleteTask = async () => {
    const res = await dispatch(deleteTaskById(selectedTask._id, token));

    deleteTaskAttachment(selectedTask._id, null, null, token);

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    handleDialogClose();
  };

  return (
    <Box className={classes.display}>
      <ViewTask
        handleModal={handleModalInfo}
        task={selectedTask}
        open={openInfo}
      />
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
      <Paper className={classes.styledPaper}>
        <Box className={classes.progressBarRoot}>
          <LinearProgressWithLabel variant='determinate' value={progress} />
        </Box>
        <TableContainer
          className={classes.styledTableContainer}
          component={Paper}>
          <Table
            stickyHeader
            aria-label='sticky table'
            className={classes.styledTable}>
            <TableHead>
              <TableRow>
                <TableCell
                  align='center'
                  style={{ minWidth: 50, maxWidth: 200 }}>
                  <b>Name</b>
                </TableCell>
                <TableCell
                  align='center'
                  style={{ minWidth: 50, maxWidth: 200 }}>
                  <b>Deadline</b>
                </TableCell>
                <TableCell
                  align='center'
                  style={{ minWidth: 50, maxWidth: 200 }}>
                  <b>Assignees</b>
                </TableCell>
                <TableCell
                  align='center'
                  style={{ minWidth: 50, maxWidth: 200 }}>
                  <b>Scheduled At</b>
                </TableCell>
                <TableCell
                  align='center'
                  style={{ minWidth: 50, maxWidth: 200 }}>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.length > 0 &&
                tasks.map((task, key) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                    <TableCell key={key} align='center'>
                      {task?.name}
                    </TableCell>
                    <TableCell key={key} align='center'>
                      <span
                        style={{
                          color:
                            new Date().getTime() >
                            new Date(task?.deadline).getTime()
                              ? '#ca0000'
                              : '#51b300',
                        }}>
                        {new Date(task?.deadline).toLocaleString('en-US', {
                          hour12: false,
                        })}
                      </span>
                    </TableCell>
                    <TableCell key={key} align='center'>
                      <AvatarGroup max={4}>
                        {task?.user?.map(
                          (taskUser, key) =>
                            taskUser.role === 'Viewer' && (
                              <LightTooltip
                                title={
                                  taskUser?.userId?._id === user?._id
                                    ? 'You'
                                    : taskUser?.userId?.firstName +
                                      ' ' +
                                      taskUser?.userId?.lastName
                                }>
                                <div className={classes.alignCenter}>
                                  <Avatar
                                    key={key}
                                    // onMouseEnter={(event) =>
                                    //   handlePopoverOpen(
                                    //     taskUser?.userId?._id === user?._id
                                    //       ? 'You'
                                    //       : taskUser?.userId?.firstName +
                                    //           ' ' +
                                    //           taskUser?.userId?.lastName,
                                    //     event,
                                    //   )
                                    // }
                                    // onMouseLeave={handlePopoverClose}
                                    // onBlur={handlePopoverClose}
                                    src={taskUser?.userId?.imagePath}>
                                    {!taskUser?.userId?.imagePath &&
                                      taskUser?.userId?.firstName?.split('')[0]}
                                  </Avatar>
                                  &nbsp; &nbsp;
                                </div>
                              </LightTooltip>
                            ),
                        )}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell key={key} align='center'>
                      {new Date(task?.createdAt).toLocaleString('en-US', {
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell key={key} align='center'>
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
              onDeleteTask();
            }}
            variant='contained'
            color='primary'
            size='small'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
