import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  FormControlLabel,
  FormGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  Grid,
  Checkbox,
  FormLabel,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoardById } from '../../../actions/actionCreators/boardActions';
import { removeListAccess } from '../../../actions/actionCreators/listActions';
import { removeCardAccess } from '../../../actions/actionCreators/cardActions';
import { openSnackbar } from '../../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  card: {
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(1),
    width: '230px',
    wordWrap: 'break-word',
    zIndex: '-100',
    '&:hover': {
      backgroundColor: '#EBECF0',
    },
  },
  checkboxes: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  alignCheckBoxes: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonRight: {
    float: 'right',
  },
}));

export default function RemoveMember({ task, column, componentUpdated }) {
  const classes = useStyles();
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { currBoard } = useSelector((state) => state.boards);
  const [listCheck, setListCheck] = useState(false);
  const [cardCheck, setCardCheck] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [listMembers, setListMembers] = useState([]);
  const [cardMembers, setCardMembers] = useState([]);

  const getBoard = async (e) => {
    if (token && id) {
      dispatch(fetchBoardById(id, token));

      await setRefresh(false);
    }
  };

  useEffect(() => {
    getBoard();
  }, [token, refresh]);

  useEffect(() => {
    if (column?.user.length > 0 && user?._id) {
      let array = column.user.filter((u) => u.userId._id !== user._id);

      setListMembers(array);
    }
  }, [column, user]);

  useEffect(() => {
    if (task?.user.length > 0 && user?._id) {
      let array = task.user.filter((u) => u.userId._id !== user._id);

      setCardMembers(array);
    }
  }, [task, user]);

  const onRemoveUser = async (e) => {
    e.preventDefault();

    const userName = e.target.name.value;

    if (userName == 'none') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Select an option from user names!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (!listCheck && !cardCheck) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Select an access type!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const roleFor = listCheck ? 'List' : 'Card';

    if (roleFor === 'Card') {
      const res = await dispatch(
        removeCardAccess(task._id, { user: { _id: userName } }, token),
      );

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
      componentUpdated();
      setRefresh(false);
    } else if (roleFor === 'List') {
      dispatch(removeCardAccess(task._id, { user: { _id: userName } }, token));
      const res = await dispatch(
        removeListAccess(column._id, { user: { _id: userName } }, token),
      );

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
      componentUpdated();
      setRefresh(false);
    }
  };

  return (
    <form onSubmit={onRemoveUser} className={classes.spacing}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h6'>Remove Member</Typography>
          <FormControl
            variant='outlined'
            className={classes.formControl}
            fullWidth>
            <InputLabel id='demo-simple-select-outlined-label'>
              User Names
            </InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              label='User Names'
              defaultValue='none'
              name='name'
              id='name'>
              <MenuItem value='none'>
                <em>None</em>
              </MenuItem>
              {/* {members?.map((member, key) => (
                  <MenuItem value={member.userId._id} key={key}>
                    {member.userId.firstName + ' ' + member.userId.lastName}
                  </MenuItem>
                ))} */}
              {listCheck
                ? listMembers?.map((member, key) => (
                    <MenuItem value={member._id} key={key}>
                      {member.userId.firstName + ' ' + member.userId.lastName}
                    </MenuItem>
                  ))
                : cardMembers?.map((member, key) => (
                    <MenuItem value={member._id} key={key}>
                      {member.userId.firstName + ' ' + member.userId.lastName}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row className={classes.alignCheckBoxes}>
            <FormLabel component='legend'>Remove Access For:</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  name='list'
                  checked={listCheck}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  color='primary'
                  onChange={() => {
                    setListCheck(!listCheck);
                    setCardCheck(true);

                    if (cardCheck && listCheck) {
                      setCardCheck(false);
                      setListCheck(false);
                    }
                  }}
                />
              }
              label='List'
            />
            <FormControlLabel
              control={
                <Checkbox
                  name='card'
                  checked={cardCheck}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  color='primary'
                  onChange={() => {
                    setCardCheck(!cardCheck);

                    if (cardCheck && listCheck) {
                      setCardCheck(false);
                      setListCheck(false);
                    }
                  }}
                />
              }
              label='Card'
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => dispatch(openLoader({ open: true }))}
            type='submit'
            size='small'
            variant='contained'
            color='primary'
            className={classes.buttonRight}>
            Remove Access
          </Button>
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </form>
  );
}
