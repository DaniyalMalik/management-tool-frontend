import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import Loader from '../Utilities/Loader';
import { verifyEmailToken } from '../../actions/actionCreators/userActions';
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
  formControl: {
    margin: theme.spacing(3),
  },
  buttonRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default function VerifyEmail() {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);
  const search = useLocation().search;
  const [loader, setLoader] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const verify = params.get('verify');

    setVerifyToken(verify);
  }, []);

  useEffect(() => {
    if (user) {
      return setEmail(user.email);
    }

    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [user, token]);

  const onVerify = async (e) => {
    e.preventDefault();

    const response = await verifyEmailToken(verifyToken, token);

    dispatch(
      openSnackbar({
        open: true,
        message: response?.message,
        severity: response?.success,
      }),
    );
    dispatch(closeLoader());
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
            Verify your Email
          </Typography>
          <form onSubmit={onVerify}>
            <div className={classes.formControl}>
              <TextField
                disabled
                label='Email'
                value={email}
                fullWidth
                size='small'
                name='email'
                variant='outlined'
              />
            </div>
            <div className={classes.formControl}>
              <Button
                disabled={user?.emailVerified || !verifyToken}
                fullWidth
                type='submit'
                size='small'
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'
                variant='contained'>
                {user?.emailVerified ? 'Email Verified' : 'Verify Email'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
