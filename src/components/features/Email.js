import React, { useState } from 'react';
import {
  makeStyles,
  Button,
  TextField,
  Chip,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { sendInviteEmail } from '../../actions/actionCreators/emailAction';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '30px',
  },
  buttonRight: {
    float: 'right',
  },
}));

export default function Email() {
  const classes = useStyles();
  const [emails, setEmails] = useState([]);
  const { user, token } = useSelector((state) => state.user);
  const [radioValue, setRadioValue] = useState('singleEmail');
  const dispatch = useDispatch();

  const onInviteUser = async (e) => {
    e.preventDefault();

    if (radioValue === 'multiEmail') {
      let terminate = false;

      if (emails.length < 1) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Enter an email!',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }

      emails.map((email) => {
        const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) {
          terminate = true;

          dispatch(
            openSnackbar({
              open: true,
              message: 'Email format is not correct!',
              severity: false,
            }),
          );
          return dispatch(closeLoader());
        }
      });

      if (terminate) {
        return;
      }

      const id = user?.companyId?._id
        ? user.companyId._id
        : user?.employId?._id;
      // const url = `http://localhost:3000/register/?cid=${id}`;
      const url = `https://bizstruc.com/register/?cid=${id}`;
      const data = {
        from: user?.email,
        emails,
        url,
        name: user?.firstName + ' ' + user?.lastName,
      };
      const res = await sendInviteEmail(data, token);

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
      setEmails([]);
    } else {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!regex.test(e.target.email.value)) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        return dispatch(closeLoader());
      }

      const id = user?.companyId?._id
        ? user.companyId._id
        : user?.employId?._id;
      // const url = `http://localhost:3000/register/?cid=${id}`;
      const url = `https://bizstruc.com/register/?cid=${id}`;
      const data = {
        email: e.target.email.value,
        url,
        from: user?.email,
        name: user?.firstName + ' ' + user?.lastName,
      };
      const res = await sendInviteEmail(data, token);

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    }
  };

  const handleChange = (event) => {
    setRadioValue(event.target.value);
  };

  return (
    <form onSubmit={onInviteUser} className={classes.spacing}>
      <Grid container spacing={3}>
        <FormControl color='primary' component='fieldset'>
          <FormLabel component='legend'>Invite Via Email</FormLabel>
          <RadioGroup
            aria-label='radioValue'
            name='radioValue'
            color='primary'
            value={radioValue}
            onChange={handleChange}>
            <FormControlLabel
              value='singleEmail'
              control={<Radio />}
              label='Single Email'
              color='primary'
            />
            <FormControlLabel
              value='multiEmail'
              control={<Radio />}
              color='primary'
              label='Multiple Emails'
            />
          </RadioGroup>
        </FormControl>
        {radioValue === 'singleEmail' && (
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              type='email'
              name='email'
              label='Invite via Email'
              placeholder='Enter an email...'
              fullWidth
            />
          </Grid>
        )}
        {radioValue === 'multiEmail' && (
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id='tags-filled'
              disableCloseOnSelect
              // options={emails.map((email) => email)}
              options={[]}
              freeSolo
              onChange={(e) => {
                if (e.target.value === undefined) {
                  let newEmails = emails;

                  newEmails.splice(newEmails.length - 1, 1);
                  return setEmails(newEmails);
                }
                setEmails(emails.concat(e.target.value));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant='outlined'
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  type='email'
                  variant='outlined'
                  label='Invite via Emails'
                  placeholder='Enter Emails'
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            type='submit'
            onClick={() => dispatch(openLoader({ open: true }))}
            disabled={!user?.emailVerified}
            variant='contained'
            color='primary'
            size='small'
            className={classes.buttonRight}>
            Send
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
