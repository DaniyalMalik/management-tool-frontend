import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { updateUserPassword } from '../../actions/actionCreators/userActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  buttonRight: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  floatRight: {
    float: 'right',
  },
}));

export default function UpdatePassword() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const [state, setState] = useState({
    oldPassword: '',
    password: '',
    passwordCheck: '',
  });
  const { passwordCheck, password, oldPassword } = state;

  const onsubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword && !password && !passwordCheck) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const data = {
      oldPassword,
      password,
      passwordCheck,
    };

    const res = await dispatch(updateUserPassword(user._id, data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      setState({ ...state, passwordCheck: '', password: '', oldPassword: '' });
    }
  };

  const onchange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
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
            Change your Password
          </Typography>
          <form onSubmit={onsubmit}>
            <div className={classes.formControl}>
              <TextField
                label='Old Password'
                value={oldPassword}
                name='oldPassword'
                size='small'
                fullWidth
                type='password'
                onChange={onchange}
                variant='outlined'
              />
            </div>
            <div className={classes.formControl}>
              <TextField
                label='New Password'
                variant='outlined'
                fullWidth
                size='small'
                type='password'
                name='password'
                value={password}
                onChange={onchange}
              />
            </div>
            <div className={classes.formControl}>
              <TextField
                label='Repeat New Password'
                fullWidth
                type='password'
                size='small'
                variant='outlined'
                value={passwordCheck}
                name='passwordCheck'
                onChange={onchange}
              />
            </div>
            <div className={classes.formControl}>
              <Button
                fullWidth
                type='submit'
                className={classes.floatRight}
                size='small'
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'
                variant='contained'>
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
