import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Box,
  Button,
  InputLabel,
  Card,
  CardContent,
} from '@material-ui/core';
import {
  updateLoggedInUser,
  fetchUserInfo,
} from '../../actions/actionCreators/userActions';
import { ImageOutlined } from '@material-ui/icons';
import { uploadProfilePicture } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styledCard: {
    minWidth: '500',
    minHeight: 'auto',
    padding: '50px',
  },
  formcontrol: {
    margin: theme.spacing(3),
  },
  buttonRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  label: {
    cursor: 'pointer',
    border: '2px solid #183569',
    color: '#183569',
    width: 'fit-content',
    padding: '2px',
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

export default function UpdateInfo() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    attachment: null,
    updated: false,
  });
  const { updated, firstName, lastName, email, phoneNumber, attachment } =
    state;

  useEffect(() => {
    if (user?.email) {
      return setState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        // attachment: user?.imagePath,
        updated: false,
      });
    }

    if (token) {
      dispatch(fetchUserInfo(token));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, updated]);

  const onPictureChange = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!firstName && !lastName && !email && !phoneNumber && !attachment) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter at least one field!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment && attachment?.type.split('/')[0] !== 'image') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Select an image!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment?.size / 1024 / 1024 > 20) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large image!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment) {
      const formData = new FormData();

      formData.append('file', attachment);

      const imageRes = await uploadProfilePicture(formData, token);

      // const imageRes = await axios.post(
      //   '/api/file/uploadprofilepicture',
      //   // `/file/uploadprofilepicture?userId=${user._id}`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       'x-auth-token': token,
      //     },
      //   },
      // );

      const data = {
        firstName,
        lastName,
        email,
        phoneNumber,
        imagePath: imageRes?.imageName,
      };

      if (!imageRes.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: imageRes?.message,
            severity: imageRes?.success,
          }),
        );
        return dispatch(closeLoader());
      }

      const res = await dispatch(updateLoggedInUser(user?._id, data, token));

      setState({ ...state, updated: true });
      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    } else {
      const data = {
        firstName,
        lastName,
        email,
        phoneNumber,
      };

      const res = await dispatch(updateLoggedInUser(user?._id, data, token));

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());

      if (res?.success) {
        setState({ ...state, updated: true });
      }
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.styledCard}>
        <CardContent>
          <Typography
            variant='h4'
            color='textSecondary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Update your Information
          </Typography>
          <form noValidate autoComplete='off' onSubmit={onSubmit}>
            <div className={classes.formcontrol}>
              <TextField
                label='Email'
                variant='outlined'
                fullWidth
                name='email'
                size='small'
                type='email'
                disabled
                value={email}
              />
            </div>
            <div className={classes.formcontrol}>
              <TextField
                label='First Name'
                value={firstName}
                name='firstName'
                fullWidth
                size='small'
                onChange={onChange}
                variant='outlined'
              />
            </div>
            <div className={classes.formcontrol}>
              <TextField
                label='Last Name'
                value={lastName}
                name='lastName'
                fullWidth
                size='small'
                onChange={onChange}
                variant='outlined'
              />
            </div>
            <div className={classes.formcontrol}>
              <TextField
                label='Phone Number'
                fullWidth
                size='small'
                name='phoneNumber'
                variant='outlined'
                value={phoneNumber}
                onChange={onChange}
              />
            </div>
            <div className={classes.formcontrol}>
              <InputLabel className={classes.label} htmlFor='file'>
                Choose a Picture&nbsp;
                <ImageOutlined />
              </InputLabel>
              <Typography variant='caption'>{attachment?.name}</Typography>
              <TextField
                className={classes.file}
                type='file'
                id='file'
                name='file'
                size='small'
                accept='image/*'
                onChange={onPictureChange}
              />
            </div>
            <div className={classes.formcontrol}>
              <Button
                fullWidth
                onClick={() => dispatch(openLoader({ open: true }))}
                type='submit'
                className={classes.floatRight}
                color='primary'
                variant='contained'
                size='small'>
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
