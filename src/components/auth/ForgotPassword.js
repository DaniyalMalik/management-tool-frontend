import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordAction } from '../../actions/actionCreators/userActions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { EmailOutlined, LockOutlined } from '@material-ui/icons';
import { useHistory, Link } from 'react-router-dom';
import AuthScreen from '../auth/AuthScreen';
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
    height: '500px',
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
      // height: 'auto',
      maxWidth: '300px',
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

export default function ForgotPassword() {
  const classes = useStyles();
  const [state, setState] = useState({
    email: '',
  });
  const { email } = state;
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user?._id && token)
      history.push('/' + user?.firstName + ' ' + user?.lastName + '/home');
  }, [user, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const res = await dispatch(forgotPasswordAction({ email }));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      setState({ ...state, email: '' });
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
                <Typography variant='h4'>Forgot Password</Typography>
                <Typography variant='body1'>
                  Enter your email address to reset the password...
                </Typography>
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
                <Button
                  className={classes.styledButton}
                  variant='contained'
                  fullWidth
                  onClick={() => dispatch(openLoader({ open: true }))}
                  type='submit'
                  color='primary'>
                  Send Email
                </Button>
              </CardContent>
              <div>
                <Typography
                  variant='subtitle2'
                  className={classes.displayCenter}>
                  Back to
                  <span>
                    <Link to='/'> Sign In</Link>
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
