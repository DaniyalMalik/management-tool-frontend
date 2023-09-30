import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../actions/actionCreators/userActions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
  BusinessOutlined,
} from '@material-ui/icons';
import AuthScreen from '../auth/AuthScreen';
import { useHistory, Link, useLocation } from 'react-router-dom';
import bizstruc_logo_black_colored from '../../assets/bizstruc_logo_black_colored.png';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  styledCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '30px',
    maxWidth: '450px',
    maxHeight: '500px',
    borderRadius: '30px',
    marginLeft: 'auto',
    marginRight: 'auto',
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

export default function Register() {
  const classes = useStyles();
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordCheck: '',
  });
  const { email, password, passwordCheck, lastName, firstName } = state;
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const companyId = params.get('cid');

  useEffect(() => {
    if (user?._id && token)
      history.push('/' + user?.firstName + ' ' + user?.lastName + '/home');
  }, [user, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !passwordCheck) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password,
      passwordCheck,
      employId: companyId,
    };

    const res = await dispatch(registerUser(newUser));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      setState({
        ...state,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordCheck: '',
      });

      history.push('/');
    } else {
      setState({
        ...state,
        password: '',
        passwordCheck: '',
      });
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <AuthScreen
      Card={
        <Card className={classes.styledCard}>
          <form className={classes.styledForm} onSubmit={submitHandler}>
            <div>
              {/* <div className={classes.styledParentLogo}>
                    <img
                      src={bizstruc_logo_black_colored}
                      alt='logo'
                      className={classes.styledLogo}
                    />
                  </div>
                  <br />
                  <br /> */}
              <Typography variant='h4'>Get Started!</Typography>
              <Typography variant='body1'>
                Sign up to join our community...
              </Typography>
            </div>
            <CardContent>
              <TextField
                className={classes.marginTopBottom}
                id='firstName'
                name='firstName'
                label='First Name'
                size='small'
                fullWidth
                value={firstName}
                onChange={onChange}
                placeholder='Enter First Name'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonOutline color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                className={classes.marginTopBottom}
                id='lastName'
                name='lastName'
                label='Last Name'
                size='small'
                fullWidth
                value={lastName}
                onChange={onChange}
                placeholder='Enter Last Name'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonOutline color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
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
                size='small'
                type='password'
                value={password}
                onChange={onChange}
                fullWidth
                label='Password'
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
              <TextField
                className={classes.marginTopBottom}
                id='passwordCheck'
                name='passwordCheck'
                size='small'
                type='password'
                value={passwordCheck}
                onChange={onChange}
                fullWidth
                label='Confirm Password'
                placeholder='Confirm Password'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockOutlined color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                className={classes.marginTopBottom}
                id='companyId'
                name='companyId'
                size='small'
                value={companyId}
                onChange={onChange}
                fullWidth
                label='Company Id'
                placeholder='Enter Company Id'
                variant='outlined'
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <BusinessOutlined color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className={classes.styledButton}
                type='submit'
                variant='contained'
                fullWidth
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'>
                Sign Up
              </Button>
            </CardContent>
            <div>
              <Typography variant='subtitle2' className={classes.displayCenter}>
                Already have an account?
                <span>
                  <Link to='/'> Sign In</Link>
                </span>
              </Typography>
            </div>
          </form>
        </Card>
      }
    />
  );
}
