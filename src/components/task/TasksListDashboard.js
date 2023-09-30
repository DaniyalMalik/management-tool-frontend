import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  CheckCircleOutline,
  HourglassEmpty,
} from '@material-ui/icons';
import { getTasksByUserId } from '../../actions/actionCreators/taskActions';

const useStyles = makeStyles((theme) => ({
  styledPaper: {
    padding: '20px',
    borderRadius: '20px',
    maxWidth: '350px',
    minWidth: '300px',
    minHeight: '300px',
    maxHeight: '380px',
    margin: '10px',
  },
  styledList: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    '& ul': { padding: 0 },
  },
}));

export default function TasksListDashboard() {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.tasks);
  const [timeEnded, setTimeEnded] = useState([]);
  const [checks, setChecks] = useState([]);
  const [show, setShow] = useState([]);
  const [hourLeft, setHourLeft] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      // const companyId = user?.companyId ? user.companyId : user?.employId

      dispatch(getTasksByUserId(token));
      // dispatch(getTasksByUserId(companyId, token))
    }
  }, [token]);

  useEffect(() => {
    if (tasks?.length > 0 && user?._id) {
      let checked = [];

      tasks.map((task) =>
        task.user.map(
          (taskUser) =>
            taskUser.userId._id === user._id &&
            (taskUser.completed ? checked.push(true) : checked.push(false)),
        ),
      );

      setChecks(checked);
      checked = [];
    }
  }, [tasks, user]);

  useEffect(() => {
    if (tasks?.length > 0 && user?._id) {
      let temp = [];

      tasks.map((task) =>
        task.user.map(
          (taskUser) =>
            taskUser.userId._id === user._id &&
            (taskUser.role === 'Editor' ? temp.push(false) : temp.push(true)),
        ),
      );

      setShow(temp);
      temp = [];
    }
  }, [tasks, user]);

  useEffect(() => {
    if (tasks?.length > 0) {
      let today = new Date();
      let time = [];

      tasks.map((task) => {
        let deadline = new Date(task.deadline);

        if (today?.getTime() >= deadline.getTime()) {
          time.push(true);
        } else {
          time.push(false);
        }
      });

      setTimeEnded(time);
      time = [];
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks?.length > 0) {
      let assignees = [];

      tasks.map((task) => {
        let deadline = new Date(task.deadline).getTime(),
          now = new Date().getTime(),
          assigner = '',
          difference = deadline - now;

        if (now < deadline && difference <= 3600000) {
          assigner = true;
        } else {
          assigner = false;
        }

        assignees.push(assigner);
      });

      setHourLeft(assignees);
    }
  }, [tasks]);

  return (
    <Paper className={classes.styledPaper}>
      <Typography variant='h5' color='textPrimary' gutterBottom>
        All Tasks
      </Typography>
      <List className={classes.styledList} subheader={<li />}>
        <Divider variant='fullWidth' component='li' />
        {tasks?.length > 0 ? (
          tasks?.map((task, key) => (
            <List
              key={key}
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}>
              <Link to={`/${user?.firstName + ' ' + user?.lastName}/tasks`}>
                <ListItem
                  alignItems='flex-start'
                  button
                  style={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemText
                    primary={task?.name}
                    secondary={
                      <>
                        <Typography variant='body2' color='textPrimary'>
                          <b>Deadline:</b>{' '}
                          <span
                            style={{
                              color: timeEnded[key] ? '#ca0000' : '#51b300',
                            }}>
                            {new Date(task?.deadline).toLocaleString('en-US', {
                              hour12: false,
                            })}
                          </span>
                        </Typography>
                        {task?.cardId?.boardId?.name && (
                          <Typography variant='body2' color='textPrimary'>
                            <b>Board Name:</b> {task?.cardId?.boardId?.name}
                          </Typography>
                        )}
                        {task?.cardId?.listId?.name && (
                          <Typography variant='body2' color='textPrimary'>
                            <b>List Name:</b> {task?.cardId?.listId?.name}
                          </Typography>
                        )}
                        {task?.cardId?.name && (
                          <Typography variant='body2' color='textPrimary'>
                            <b>Card Name:</b> {task?.cardId?.name}
                          </Typography>
                        )}
                        <Typography variant='body2' color='textPrimary'>
                          <b>Assignees:</b> {task?.userId?.name}
                          {task.user.length > 0 &&
                            task.user.map(
                              (task) =>
                                task.userId._id !== user._id &&
                                task.userId.firstName +
                                  ' ' +
                                  task.userId.lastName +
                                  ', ',
                            )}
                        </Typography>
                      </>
                    }
                  />
                  {checks[key] ? (
                    <>
                      {hourLeft[key] && (
                        <HourglassEmpty
                          style={{ color: '#ca0000' }}
                          fontSize='small'
                        />
                      )}
                      <CheckCircle color='primary' fontSize='small' />
                    </>
                  ) : (
                    <>
                      {hourLeft[key] && (
                        <HourglassEmpty
                          fontSize='small'
                          style={{ color: '#ca0000' }}
                        />
                      )}
                      {show[key] && (
                        <CheckCircleOutline color='primary' fontSize='small' />
                      )}
                    </>
                  )}
                </ListItem>
              </Link>
              <Divider variant='fullWidth' component='li' />
            </List>
          ))
        ) : (
          <Typography variant='h6' style={{ textAlign: 'center' }}>
            No tasks available
          </Typography>
        )}
      </List>
    </Paper>
  );
}
