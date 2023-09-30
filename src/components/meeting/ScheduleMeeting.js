import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { Room, VideoCall, Call } from '@material-ui/icons';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { addToMeeting } from '../../actions/actionCreators/meetingActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/lab';
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
}));

export default function ScheduleMeeting({ handleChangeIndex }) {
  const { token, user, companyUsers } = useSelector((state) => state.user);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [alignment, setAlignment] = useState('Audio Call');
  const [disabled, setDisabled] = useState(true);
  const [meetingAgenda, setMeetingAgenda] = useState('');

  useEffect(() => {
    setDisabled(false);
  }, []);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

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
    if (companyUsers.length > 0 && user?._id) {
      let array = companyUsers.filter((u) => u._id !== user._id);

      setFilteredUsers(array);
    }
  }, [companyUsers, user]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const dateChose = new Date(e.target.dateAndTime.value).getTime();
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
      !alignment ||
      !meetingAgenda ||
      meetingAgenda ===
        '<p><small>Enter meeting agenda (Maximum length of 2000 characters)</small></p>' ||
      participants.length === 0
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

    if (alignment === 'Audio Call' && !number) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (alignment === 'Video Call' && !password) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (alignment === 'Face-to-Face' && !location) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (alignment === 'Video Call' && password) {
      let length = password.split('').length;

      if (length > 10) {
        dispatch(
          openSnackbar({
            open: true,
            message:
              'A password can only have a maximum length of 10 characters.',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }
    }

    const assignees = [
      {
        userId: user._id,
        role: 'Scheduler',
      },
    ];

    participants.map((participant) =>
      assignees.push({ userId: participant._id, role: 'Participant' }),
    );

    const data = {
      topic: e.target.topic.value,
      companyId: user?.companyId ? user.companyId : user?.employId,
      location: alignment === 'Face-to-Face' ? location : null,
      phoneNumber: alignment === 'Audio Call' ? number : null,
      meetingAgenda,
      dateAndTime: e.target.dateAndTime.value,
      type: alignment,
      password: alignment === 'Video Call' ? password : null,
      user: assignees,
    };

    const res = await dispatch(addToMeeting(data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      handleChangeIndex(0);
      setDisabled(true);

      const assignees = [];

      participants.map(
        (participant) =>
          participant._id != user._id &&
          assignees.push({ userId: participant._id }),
      );

      dispatch(
        postNotification(
          {
            title: 'Meeting Scheduled',
            description: 'has just scheduled a meeting with you!',
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

  return (
    <div className={classes.parentDiv}>
      <Card className={classes.styledCard}>
        <CardContent>
          <Typography
            variant='h4'
            color='textPrimary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Schedule a New Meeting
          </Typography>
          <form onSubmit={onSubmit}>
            <div>
              <TextField
                label='Topic'
                name='topic'
                id='topic'
                required
                variant='outlined'
                fullWidth
              />
            </div>
            <br />
            <div>
              <Editor
                value={meetingAgenda}
                initialValue={
                  '<small>Enter meeting agenda (Maximum length of 2000 characters)</small>'
                }
                onBlur={(e) => {
                  if (meetingAgenda === '') {
                    setMeetingAgenda(
                      '<p><small>Enter meeting agenda (Maximum length of 2000 characters)</small></p>',
                    );
                  }
                }}
                onFocus={(e) => {
                  if (
                    meetingAgenda ===
                    '<p><small>Enter meeting agenda (Maximum length of 2000 characters)</small></p>'
                  ) {
                    setMeetingAgenda('');
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
                  setMeetingAgenda(content);
                }}
              />
            </div>
            <br />
            <div>
              <TextField
                label='Date and Time'
                fullWidth
                required
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                name='dateAndTime'
                id='dateAndTime'
                type='datetime-local'
              />
            </div>
            <br />
            <div>
              <Autocomplete
                multiple
                required
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
                    label='Participants'
                    placeholder='Choose participants'
                  />
                )}
              />
            </div>
            <br />
            <div style={{ textAlign: 'center' }}>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                color='primary'
                fullWidth
                onChange={handleAlignment}
                aria-label='text alignment'>
                <ToggleButton value='Audio Call' aria-label='left aligned'>
                  <Call color='primary' fontSize='small' />
                  &nbsp;
                  <span style={{ fontSize: 'smaller' }}>Audio Call</span>
                </ToggleButton>
                <ToggleButton value='Video Call' aria-label='centered'>
                  <VideoCall color='primary' fontSize='small' />
                  &nbsp;
                  <span style={{ fontSize: 'smaller' }}>Video Call</span>
                </ToggleButton>
                <ToggleButton value='Face-to-Face' aria-label='right aligned'>
                  <Room color='primary' fontSize='small' />
                  &nbsp;
                  <span style={{ fontSize: 'smaller' }}>Face-to-Face</span>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <br />
            {alignment === 'Audio Call' ? (
              <TextField
                label='Phone Number'
                fullWidth
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                variant='outlined'
                name='phoneNumber'
                id='phoneNumber'
              />
            ) : alignment === 'Video Call' ? (
              <TextField
                label='Meeting Password'
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant='outlined'
                required
                name='password'
                id='password'
                type='password'
              />
            ) : (
              alignment === 'Face-to-Face' && (
                <TextField
                  label='Location'
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  variant='outlined'
                  name='location'
                  id='location'
                />
              )
            )}
            <br />
            <br />
            <Button
              type='submit'
              autoFocus
              disabled={disabled}
              variant='contained'
              onClick={() => dispatch(openLoader({ open: true }))}
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
