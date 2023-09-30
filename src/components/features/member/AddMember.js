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
  Radio,
  RadioGroup,
  Checkbox,
  FormLabel,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoardByIdPut } from '../../../actions/actionCreators/boardActions';
import { updateListByIdPut } from '../../../actions/actionCreators/listActions';
import { updateCardByIdPut } from '../../../actions/actionCreators/cardActions';
import { postNotification } from '../../../actions/actionCreators/notificationActions';
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

export default function AddMember({ task, column, componentUpdated }) {
  const classes = useStyles();
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.user);
  const { currBoard } = useSelector((state) => state.boards);
  const dispatch = useDispatch();
  const [access, setAccess] = useState('Viewer');
  const [listCheck, setListCheck] = useState(false);
  const [cardCheck, setCardCheck] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (currBoard?.user.length > 0) {
      let array = currBoard.user.filter((u) => u.userId._id !== user._id);

      setMembers(array);
    }
  }, [currBoard, user]);

  const onAddUser = async (e) => {
    e.preventDefault();

    let isAdmin = false;
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
          message: 'Select an option from access for!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    currBoard.user.map((u) => {
      if (userName === u.userId._id && u.role === 'Admin') {
        isAdmin = true;

        dispatch(
          openSnackbar({
            open: true,
            message: "Access of board's admin cannot be changed!",
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }
    });

    if (!isAdmin) {
      const roleFor = cardCheck ? 'Card' : 'List';
      const data = {
        user: { userId: userName, role: access },
      };

      if (roleFor === 'Card') {
        dispatch(updateCardByIdPut(task._id, data, token));
        await dispatch(updateListByIdPut(column._id, data, token));
        const res = await dispatch(updateBoardByIdPut(id, data, token));

        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());
        componentUpdated();

        isAdmin = false;

        if (res?.success) {
          dispatch(
            postNotification(
              {
                title: 'Added in a Card',
                description: 'has just added you to a card!',
                companyId: user?.companyId?._id
                  ? user.companyId._id
                  : user?.employId?._id,
                from: user?._id,
                for: { userId: userName },
              },
              token,
            ),
          );
        }
      } else if (roleFor === 'List') {
        dispatch(updateListByIdPut(column._id, data, token));
        const res = await dispatch(updateBoardByIdPut(id, data, token));

        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());
        componentUpdated();

        isAdmin = false;

        if (res?.success) {
          dispatch(
            postNotification(
              {
                title: 'Added in  a List',
                description: 'has just added you to a list!',
                companyId: user?.companyId?._id
                  ? user.companyId._id
                  : user?.employId?._id,
                from: user?._id,
                for: { userId: userName },
              },
              token,
            ),
          );
        }
      }
    }
  };

  const handleChange = (event) => {
    setAccess(event.target.value);
  };

  return (
    <form onSubmit={onAddUser} className={classes.spacing}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h6'>Add Member</Typography>
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
              {members?.map((member, key) => (
                <MenuItem value={member._id} key={key}>
                  {member.userId.firstName + ' ' + member.userId.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row className={classes.alignCheckBoxes}>
            <FormLabel component='legend'>Allow Access For:</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  name='list'
                  checked={listCheck}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  color='primary'
                  onChange={() => {
                    setCardCheck(false);
                    setListCheck(!listCheck);
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
                    setListCheck(true);
                    setCardCheck(!cardCheck);
                  }}
                />
              }
              label='Card'
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row className={classes.alignCheckBoxes}>
            <FormLabel component='legend'>Access Type:</FormLabel>
            <RadioGroup
              aria-label='Access Type'
              name='Access Type'
              value={access}
              style={{ display: 'contents' }}
              onChange={handleChange}>
              <FormControlLabel
                value='Viewer'
                control={<Radio />}
                label='Viewer'
              />
              <FormControlLabel
                value='Editor'
                control={<Radio />}
                label='Editor'
              />
            </RadioGroup>
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            type='submit'
            onClick={() => dispatch(openLoader({ open: true }))}
            size='small'
            variant='contained'
            color='primary'
            className={classes.buttonRight}>
            Allow Access
          </Button>
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </form>
  );
}
