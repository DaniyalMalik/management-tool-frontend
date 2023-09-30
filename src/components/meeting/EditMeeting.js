import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import {
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { updateSingleFromMeeting } from '../../actions/actionCreators/meetingActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Room, VideoCall, Call } from '@material-ui/icons';
import { Close } from '@material-ui/icons';
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
  floatRight: {
    float: 'right',
  },
}));

export default function EditUser({ open, meeting, handleModal }) {
  const classes = useStyles();
  const { token, user, companyUsers } = useSelector((state) => state.user);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const dispatch = useDispatch();
  const [alignment, setAlignment] = useState('');
  const [state, setState] = useState({
    topic: '',
    dateAndTime: '',
    disableCall: false,
    disableVideo: false,
    meetingAgenda: '',
    disableF2f: false,
    location: '',
    phoneNumber: '',
    password: '',
  });
  const {
    topic,
    dateAndTime,
    disableCall,
    meetingAgenda,
    disableVideo,
    disableF2f,
    location,
    phoneNumber,
    password,
  } = state;

  useEffect(() => {
    if (meeting) {
      setAlignment(meeting.type);

      if (meeting.type === 'Face-to-Face') {
        setState({
          ...state,
          topic: meeting.topic,
          dateAndTime: meeting.dateAndTime,
          location: meeting.location,
          disableF2f: false,
          disableVideo: true,
          meetingAgenda: meeting.meetingAgenda,
          disableCall: true,
        });
      } else if (meeting.type === 'Audio Call') {
        setState({
          ...state,
          topic: meeting.topic,
          dateAndTime: meeting.dateAndTime,
          meetingAgenda: meeting.meetingAgenda,
          phoneNumber: meeting.phoneNumber,
          disableF2f: true,
          disableVideo: true,
          disableCall: false,
        });
      } else {
        setState({
          ...state,
          topic: meeting.topic,
          dateAndTime: meeting.dateAndTime,
          password: meeting.password,
          meetingAgenda: meeting.meetingAgenda,
          disableF2f: true,
          disableVideo: false,
          disableCall: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);

  useEffect(() => {
    if (meeting) {
      let array = [];

      meeting.user.map(
        (u) => u.userId._id !== user._id && array.push(u.userId),
      );

      setParticipants(array);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  useEffect(() => {
    if (companyUsers.length > 0) {
      let array = companyUsers.filter((u) => u._id !== user._id);

      setFilteredUsers(array);
    }
  }, [companyUsers, user]);

  const onUpdate = async (e) => {
    e.preventDefault();

    if (participants.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Choose participants!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const assignees = [
      {
        userId: user._id,
        role: 'Scheduler',
      },
    ];

    participants.map((participant) =>
      assignees.push({ userId: participant._id, role: 'participant' }),
    );

    const data = {
      name: topic,
      dateAndTime,
      meetingAgenda,
      phoneNumber,
      user: assignees,
    };

    const res = await dispatch(
      updateSingleFromMeeting(meeting._id, data, token),
    );

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    handleModal();
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        Meeting Information
      </DialogTitle>
      <form onSubmit={onUpdate}>
        <DialogContent>
          <div>
            <TextField
              label='Topic'
              name='topic'
              required
              value={topic}
              onChange={onChange}
              variant='outlined'
              fullWidth
            />
          </div>
          <br />
          <div>
            <Editor
              value={meetingAgenda}
              initialValue={
                !meeting.meetingAgenda &&
                '<small>Enter meeting agenda (Maximum length of 2000 characters)</small>'
              }
              onBlur={(e) => {
                if (!meetingAgenda && !meeting.meetingAgenda) {
                  setState({
                    ...state,
                    meetingAgenda:
                      '<p><small>Enter meeting agenda (Maximum length of 2000 characters)</small></p>',
                  });
                }
              }}
              onFocus={(e) => {
                if (
                  !meeting?.meetingAgenda &&
                  meetingAgenda ===
                    '<p><small>Enter meeting agenda (Maximum length of 2000 characters)</small></p>'
                ) {
                  setState({ ...state, meetingAgenda: '' });
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
                setState({ ...state, meetingAgenda: content });
              }}
            />
          </div>
          <br />
          <div>
            <TextField
              label='Date and Time'
              fullWidth
              value={dateAndTime}
              onChange={onChange}
              required
              variant='outlined'
              InputLabelProps={{
                shrink: true,
              }}
              name='dateAndTime'
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
              // size="large"
              fullWidth
              onChange={handleAlignment}
              aria-label='text alignment'>
              <ToggleButton
                value='Audio Call'
                aria-label='left aligned'
                disabled={disableCall}>
                <Call color='primary' fontSize='small' />
                &nbsp;
                <span style={{ fontSize: 'smaller' }}>Audio Call</span>
              </ToggleButton>
              <ToggleButton
                value='Video Call'
                aria-label='centered'
                disabled={disableVideo}>
                <VideoCall color='primary' fontSize='small' />
                &nbsp;
                <span style={{ fontSize: 'smaller' }}>Video Call</span>
              </ToggleButton>
              <ToggleButton
                value='Face-to-Face'
                aria-label='right aligned'
                disabled={disableF2f}>
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
              variant='outlined'
              name='phoneNumber'
              value={phoneNumber}
              onChange={onChange}
              id='phoneNumber'
            />
          ) : alignment === 'Video Call' ? (
            <TextField
              label='Meeting Password'
              fullWidth
              variant='outlined'
              onChange={onChange}
              name='password'
              value={password}
              id='password'
              type='password'
            />
          ) : (
            alignment === 'Face-to-Face' && (
              <TextField
                label='Location'
                onChange={onChange}
                fullWidth
                required
                variant='outlined'
                name='location'
                value={location}
                id='location'
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type='submit'
            autoFocus
            onClick={() => dispatch(openLoader({ open: true }))}
            size='small'
            variant='contained'
            className={classes.floatRight}
            color='primary'>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
