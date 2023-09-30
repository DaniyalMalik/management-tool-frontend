import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Box,
  Button,
  Card,
  CardContent,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {
  updateLoggedInUser,
  fetchUserInfo,
} from '../../actions/actionCreators/userActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  formcontrol: {
    margin: theme.spacing(3),
  },
  styledDiv: {
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
}));

export default function UpdateSubscribe() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSubscribeUpdate = async (e) => {
    e.preventDefault();

    const res = await dispatch(
      updateLoggedInUser(user?._id, { subscribed: true }, token),
    );

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
  };

  return (
    <div className={classes.styledDiv}>
      <Card className={classes.styledCard}>
        <CardContent>
          <Typography
            variant='h4'
            color='textSecondary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Subscribe to BIZSTRUC
          </Typography>
          <Typography
            color='textSecondary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Subscribe to receive occational updates from us
          </Typography>
          <form noValidate autoComplete='off' onSubmit={onSubscribeUpdate}>
            <div className={classes.formcontrol}>
              <Button
                fullWidth
                onClick={() => dispatch(openLoader({ open: true }))}
                type='submit'
                color='primary'
                disabled={user?.subscribed}
                variant='contained'
                size='small'>
                Subscribe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
