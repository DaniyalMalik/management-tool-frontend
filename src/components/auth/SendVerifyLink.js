import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import {
  fetchUserInfo,
  getVerifyEmailToken,
} from '../../actions/actionCreators/userActions';
import { sendVerifyEmail } from '../../actions/actionCreators/emailAction';
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
  formControl: {
    margin: theme.spacing(3),
  },
  buttonRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  styledCard: {
    minWidth: '500',
    minHeight: 'auto',
    padding: '50px',
  },
}));

export default function SendVerifyLink() {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await getVerifyEmailToken(
      { _id: user?._id, email: user?.email },
      token,
    );

    if (response?.success) {
      const data = {
        id: user?._id,
        name: user?.firstName + ' ' + user?.lastName,
        email: user?.email,
        subject: 'Email Verification',
        resetToken: response?.resetToken,
      };
      const res = await sendVerifyEmail(data, token);

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: response?.message,
          severity: response?.success,
        }),
      );
      dispatch(closeLoader());
    }
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
            Send Verification Email
          </Typography>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <TextField
                disabled
                label='Email'
                value={user?.email}
                fullWidth
                size='small'
                name='email'
                variant='outlined'
              />
            </div>
            <div className={classes.formControl}>
              <Button
                fullWidth
                type='submit'
                disabled={user?.emailVerified}
                size='small'
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'
                variant='contained'>
                {user?.emailVerified ? 'Email Verified' : 'Send Email'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
