import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { createCompany } from '../../actions/actionCreators/companyActions';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
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
  fontColor: {
    color: '#183569',
  },
}));

export default function CreateCompany() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [subscription, setSubscription] = useState('Free');
  const { token, user } = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const { name, email, phoneNumber } = state;

  const getUserInfo = async () => {
    if (token) {
      dispatch(fetchUserInfo(token));

      await setRefresh(false);
      // await setValue(0);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [token, refresh]);

  const handleSubscription = (event, newSubscription) => {
    if (newSubscription !== null) {
      setSubscription(newSubscription);
    }
  };

  const onSubmit = async (e) => {
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
    setRefresh((prev) => !prev);
    setState({
      ...state,
      name: '',
      email: '',
      phoneNumber: '',
    });
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.styledDiv}>
      <Card
        style={{
          minWidth: '500',
          minHeight: 'auto',
          padding: '50px',
        }}>
        <CardContent>
          <Typography
            variant='h4'
            color='textSecondary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Create your Company
          </Typography>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <TextField
                label='Company Email'
                variant='outlined'
                fullWidth
                name='email'
                size='small'
                type='email'
                onChange={onChange}
                value={email}
              />
            </div>
            <div className={classes.formControl}>
              <TextField
                label='Company Name'
                value={name}
                name='name'
                size='small'
                fullWidth
                onChange={onChange}
                variant='outlined'
              />
            </div>
            <div className={classes.formControl}>
              <TextField
                label='Company Phone Number'
                fullWidth
                size='small'
                name='phoneNumber'
                variant='outlined'
                value={phoneNumber}
                onChange={onChange}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <ToggleButtonGroup
                value={subscription}
                exclusive
                color='primary'
                fullWidth
                onChange={handleSubscription}
                aria-label='text alignment'>
                <ToggleButton
                  color='primary'
                  className={classes.fontColor}
                  value='Free'
                  aria-label='left aligned'>
                  Free
                  {/* <span style={{ fontSize: 'smaller' }}>Free</span> */}
                </ToggleButton>
                <ToggleButton
                  className={classes.fontColor}
                  value='Bronze'
                  color='primary'
                  aria-label='left aligned'>
                  Bronze
                  {/* <span style={{ fontSize: 'smaller' }}>Bronze</span> */}
                </ToggleButton>
                <ToggleButton
                  className={classes.fontColor}
                  value='Silver'
                  color='primary'
                  aria-label='centered'>
                  Silver
                  {/* <span style={{ fontSize: 'smaller' }}>Silver</span> */}
                </ToggleButton>
                <ToggleButton
                  className={classes.fontColor}
                  value='Golden'
                  color='primary'
                  aria-label='right aligned'>
                  Golden
                  {/* <span style={{ fontSize: 'smaller' }}>Golden</span> */}
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className={classes.formControl}>
              <Button
                fullWidth
                onClick={() => setLoader(true)}
                type='submit'
                size='small'
                disabled={user?.companyId?._id || user?.employId?._id}
                color='primary'
                variant='contained'>
                Create Company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
