import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
  BusinessOutlined,
} from '@material-ui/icons';
import CompanyDashboardTemplate from '../company/CompanyDashboardTemplate';
import { createCompany } from '../../actions/actionCreators/companyActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

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
  fontColor: {
    color: '#183569',
  },
  displayCenter: {
    textAlign: 'center',
  },
}));

export default function CompanyDashboard() {
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const { email, phoneNumber, name } = state;
  const { user, token } = useSelector((state) => state.user);
  const [subscription, setSubscription] = useState('Free');
  const dispatch = useDispatch();
  const history = useHistory();

  // useEffect(() => {
  //   if (user?.companyId?._id || user?.employId?._id) {
  //     history.goBack();
  //   }
  // }, [user]);

  const handleSubscription = (event, newSubscription) => {
    if (newSubscription !== null) {
      setSubscription(newSubscription);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber || !user?._id) {
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
      name,
      email,
      phoneNumber,
      companyOwner: user._id,
      subscription,
    };
    const res = await dispatch(createCompany(data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success) {
      dispatch(fetchUserInfo(token));
      setState({
        ...state,
        name: '',
        email: '',
        phoneNumber: '',
      });

      history.push('/' + user?.firstName + ' ' + user?.lastName + '/home');
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <CompanyDashboardTemplate
      Card={
        <Card className={classes.styledCard}>
          <form className={classes.styledForm} onSubmit={submitHandler}>
            <div>
              <Typography variant='h4'>Create your Company</Typography>
              <Typography variant='body1'>
                Create company to use more features...
              </Typography>
            </div>
            {/* <CardContent>
              <TextField
                className={classes.marginTopBottom}
                label='Company Email'
                placeholder='Company Email'
                variant='outlined'
                fullWidth
                name='email'
                size='small'
                type='email'
                onChange={onChange}
                value={email}
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
                label='Company Name'
                placeholder='Company Name'
                value={name}
                name='name'
                size='small'
                fullWidth
                onChange={onChange}
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
                label='Company Phone Number'
                placeholder='Company Phone Number'
                fullWidth
                size='small'
                name='phoneNumber'
                variant='outlined'
                value={phoneNumber}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailOutlined color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
              <div className={classes.displayCenter}>
                <ToggleButtonGroup
                  value={subscription}
                  exclusive
                  color='primary'
                  fullWidth
                  onChange={handleSubscription}
                  aria-label='text alignment'>
                  <ToggleButton
                    className={classes.fontColor}
                    value='Free'
                    aria-label='left aligned'>
                    Free
                  </ToggleButton>
                  <ToggleButton
                    className={classes.fontColor}
                    value='Bronze'
                    aria-label='left aligned'>
                    Bronze
                  </ToggleButton>
                  <ToggleButton
                    className={classes.fontColor}
                    value='Silver'
                    aria-label='centered'>
                    Silver
                  </ToggleButton>
                  <ToggleButton
                    className={classes.fontColor}
                    value='Golden'
                    aria-label='right aligned'>
                    Golden
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <br />
              <Button
                className={classes.styledButton}
                type='submit'
                variant='contained'
                fullWidth
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'>
                Create Company
              </Button>
              <br />
              <br />
              <Typography variant='body1' className={classes.displayCenter}>
                Go
                <Link
                  to={'/' + user?.firstName + ' ' + user?.lastName + '/home'}>
                  &nbsp;<b>Home</b>
                </Link>
              </Typography>
            </CardContent> */}
          </form>
        </Card>
      }
    />
  );
}
