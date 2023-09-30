import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  CircularProgress,
  Divider,
  Paper,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getTasksByUserId } from '../../actions/actionCreators/taskActions';

const useStyles = makeStyles((theme) => ({
  styledPaper: {
    padding: '20px',
    borderRadius: '20px',
    maxWidth: '350px',
    minWidth: '300px',
    minHeight: '300px',
    backgroundColor: '#0e2b5d',
    display: 'flex',
    margin: '10px',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

export default function TaskProgressDashboard() {
  const { user, token } = useSelector((state) => state.user);
  const classes = useStyles();
  const { tasks } = useSelector((state) => state.tasks);
  const [overAllCompleted, setOverAllCompleted] = useState([]);
  const [completed, setCompleted] = useState([]);
  const dispatch = useDispatch();
  const [progress_1, setProgress_1] = useState(0);
  const [progress_2, setProgress_2] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch(getTasksByUserId(token));
    }
  }, [token]);

  useEffect(() => {
    if (tasks?.length > 0 && user?._id) {
      let complete = [];

      tasks.map((task) =>
        task.user.map(
          (taskUser) =>
            taskUser.userId._id === user._id &&
            (taskUser?.completed ? complete.push(true) : complete.push(false)),
        ),
      );

      setOverAllCompleted(complete);
      complete = [];
    }
  }, [tasks, user]);

  useEffect(() => {
    if (tasks?.length > 0 && user?._id) {
      let today = new Date();
      let complete = [];

      tasks.map((task) => {
        let deadline = new Date(task.deadline);

        task.user.map(
          (taskUser) =>
            taskUser.userId._id === user._id &&
            (today?.getTime() < deadline.getTime() && taskUser.completed
              ? complete.push(true)
              : today?.getTime() < deadline.getTime() &&
                !taskUser.completed &&
                complete.push(false)),
        );
      });

      setCompleted(complete);
      complete = [];
    }
  }, [tasks, user]);

  useEffect(() => {
    if (overAllCompleted?.length > 0) {
      let count = 0;

      overAllCompleted.map((complete) => complete && count++);

      let calculateProgress = (count / overAllCompleted.length) * 100;

      setProgress_1(calculateProgress);
    }
  }, [overAllCompleted]);

  useEffect(() => {
    if (completed?.length > 0) {
      let count = 0;

      completed.map((complete) => complete && count++);

      let calculateProgress = (count / completed.length) * 100;

      setProgress_2(calculateProgress);
    }
  }, [completed]);

  return (
    <Paper className={classes.styledPaper}>
      <Typography
        variant='h5'
        style={{ color: '#ffffff', alignSelf: 'flex-start' }}
        gutterBottom>
        Progress
      </Typography>
      <Divider />
      <div>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={130}
            color='secondary'
            thickness={6}
            variant='determinate'
            value={progress_1}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Typography
              variant='body2'
              component='div'
              style={{ color: '#ffffff' }}>
              {`${progress_1.toFixed(1)}%`}
            </Typography>
          </Box>
        </Box>
      </div>
      <Typography variant='caption' style={{ color: '#ffffff' }}>
        Overall completed tasks
      </Typography>
      <Divider />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1, height: '5px !important' }}>
            <LinearProgress
              color='secondary'
              variant='determinate'
              value={progress_2}
              style={{
                height: '5px !important',
              }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant='body2'
              style={{ color: '#ffffff' }}>{`${progress_2.toFixed(
              1,
            )}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant='caption' style={{ color: '#ffffff' }}>
        Current completed tasks before deadline
      </Typography>
    </Paper>
  );
}
