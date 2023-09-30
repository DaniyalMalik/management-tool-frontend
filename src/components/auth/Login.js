import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../actions/actionCreators/userActions';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { EmailOutlined, LockOutlined } from '@material-ui/icons';
import AuthScreen from '../auth/AuthScreen';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  styledCard: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '30px',
    maxWidth: '450px',
    height: '500px',
    borderRadius: '30px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '450px',
      maxHeight: '500px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '20px',
      maxWidth: '400px',
      maxHeight: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '300px',
      // height: 'auto',
      padding: '30px',
      maxHeight: '480px',
    },
  },
  styledForm: {
    margin: '10px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  },
  colorWhite: {
    color: '#ffffff',
  },
  marginTopBottom: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  styledButton: {
    borderRadius: '8px',
  },
  floatRight: {
    float: 'right',
    padding: '5px',
  },
  styledTopContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  styledLogo: {
    width: '200px',
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  styledParentLogo: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

export default function Login() {
  const classes = useStyles();
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const { email, password } = state;
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user?._id && token)
      history.push('/' + user?.firstName + ' ' + user?.lastName + '/home');
  }, [user, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const loginReq = {
      email,
      password,
    };

    const res = await dispatch(loginUser(loginReq));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      localStorage.setItem('bizstruc-token', res?.token);

      setState({ ...state, email: '', password: '' });

      history.push(
        '/' + res?.user?.firstName + ' ' + res?.user?.lastName + '/home',
      );
    } else {
      localStorage.setItem('bizstruc-token', null);

      setState({ ...state, password: '' });
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <AuthScreen
      Card={
        <>
          <Card className={classes.styledCard}>
            <form className={classes.styledForm} onSubmit={submitHandler}>
              {/* <div className={classes.styledParentLogo}>
                  <img
                    src={bizstruc_logo_black_colored}
                    alt='logo'
                    className={classes.styledLogo}
                  />
                </div>
                <br />
                <br /> */}
              <div>
                <Typography variant='h4'>Welcome Back!</Typography>
                <Typography variant='body1'>Sign in to continue...</Typography>
              </div>
              <CardContent>
                <TextField
                  className={classes.marginTopBottom}
                  id='email'
                  name='email'
                  label='Email'
                  type='email'
                  size='small'
                  fullWidth
                  value={email}
                  onChange={onChange}
                  placeholder='Enter Email'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailOutlined color='primary' />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className={classes.marginTopBottom}
                  id='password'
                  name='password'
                  label='Password'
                  size='small'
                  type='password'
                  value={password}
                  onChange={onChange}
                  fullWidth
                  placeholder='Enter Password'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockOutlined color='primary' />
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant='body2' className={classes.floatRight}>
                  <Link to='/forgotpassword'>Forgot Password?</Link>
                </Typography>
                <Button
                  className={classes.styledButton}
                  type='submit'
                  variant='contained'
                  onClick={() => dispatch(openLoader({ open: true }))}
                  fullWidth
                  color='primary'>
                  Sign In
                </Button>
              </CardContent>
              <div>
                <Typography
                  variant='subtitle2'
                  className={classes.displayCenter}>
                  Don't have an account?
                  <span>
                    <Link to='/register'> Sign Up</Link>
                  </span>
                </Typography>
              </div>
            </form>
          </Card>
        </>
      }
    />
  );
}
