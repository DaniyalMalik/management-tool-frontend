import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { HourglassEmpty } from '@material-ui/icons';
import { getManyFromMeeting } from '../../actions/actionCreators/meetingActions';

const useStyles = makeStyles((theme) => ({
  styledPaper: {
    margin: '10px',
    padding: '20px',
    borderRadius: '20px',
    maxWidth: '350px',
    minWidth: '300px',
    minHeight: '300px',
    maxHeight: '380px',
  },
  styledList: {
    width: '100%',
    maxHeight: 300,
    maxWidth: 360,
    bgcolor: 'background.paper',
    position: 'relative',
    overflow: 'auto',
    '& ul': { padding: 0 },
  },
}));

export default function MeetingsListDashboard() {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const { meetings } = useSelector((state) => state.meetings);
  const [hourLeft, setHourLeft] = useState([]);
  const dispatch = useDispatch();

  const getResponse = () => {
    if (user?._id && token) {
      dispatch(getManyFromMeeting(user._id, token));
    }
  };

  useEffect(() => {
    getResponse();
  }, [token, user]);

  useEffect(() => {
    if (meetings?.length > 0) {
      let assignees = [];

      meetings.map((meeting) => {
        let deadline = new Date(meeting.dateAndTime).getTime(),
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
  }, [meetings]);

  return (
    <Paper className={classes.styledPaper}>
      <Typography variant='h5' color='textPrimary' gutterBottom>
        All Meetings
      </Typography>
      <List className={classes.styledList} subheader={<li />}>
        <Divider variant='fullWidth' component='li' />
        {meetings?.length > 0 ? (
          meetings?.map((meeting, key) => (
            <List
              key={key}
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}>
              <Link to={`/${user?.firstName + ' ' + user?.lastName}/meetings`}>
                <ListItem
                  key={key}
                  button
                  alignItems='flex-start'
                  style={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemText
                    primary={meeting?.topic}
                    secondary={
                      <>
                        <Typography variant='body2' color='textPrimary'>
                          <b>Type:</b> {meeting.type}
                        </Typography>
                        <Typography variant='body2' color='textPrimary'>
                          <b>Scheduled At:</b>{' '}
                          <span
                            style={{
                              color:
                                new Date().getTime() >
                                new Date(meeting.dateAndTime).getTime()
                                  ? '#ca0000'
                                  : '#51b300',
                            }}>
                            {new Date(meeting?.dateAndTime).toLocaleString(
                              'en-US',
                              {
                                hour12: false,
                              },
                            )}
                          </span>
                        </Typography>
                        <Typography variant='body2' color='textPrimary'>
                          <b>Members:</b>{' '}
                          {meeting?.user?.length > 0 &&
                            meeting?.user?.map(
                              (u) =>
                                u?.userId?.firstName +
                                ' ' +
                                u?.userId?.lastName +
                                ', ',
                            )}
                        </Typography>
                      </>
                    }
                  />
                  {hourLeft[key] && (
                    <HourglassEmpty
                      style={{ color: '#ca0000' }}
                      fontSize='small'
                    />
                  )}
                </ListItem>
              </Link>
              <Divider variant='fullWidth' component='li' />
            </List>
          ))
        ) : (
          <Typography variant='h6' style={{ textAlign: 'center' }}>
            No meetings schedule available
          </Typography>
        )}
      </List>
    </Paper>
  );
}
