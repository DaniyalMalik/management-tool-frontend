import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  Grid,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBoardById,
  removeBoardAccess,
} from '../../actions/actionCreators/boardActions';
import { bulkRemoveList } from '../../actions/actionCreators/listActions';
import { bulkRemoveCard } from '../../actions/actionCreators/cardActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

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

export default function RemoveBoardMember({ componentUpdated }) {
  const classes = useStyles();
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const { currBoard } = useSelector((state) => state.boards);
  const [refresh, setRefresh] = useState(false);

  const getBoards = async (e) => {
    if (token && id) {
      dispatch(fetchBoardById(id, token));

      await setRefresh(false);
    }
  };

  useEffect(() => {
    getBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refresh]);

  useEffect(() => {
    if (currBoard.user.length > 0) {
      let array = currBoard.user.filter((u) => u.userId._id !== user._id);

      setMembers(array);
    }
  }, [currBoard, user]);

  const onRemoveUser = async (e) => {
    e.preventDefault();

    const userName = e.target.name.value;

    if (userName === 'none') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Select an option from user names!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    dispatch(bulkRemoveCard(id, { user: { _id: userName } }, token));
    await dispatch(bulkRemoveList(id, { user: { _id: userName } }, token));
    const res = await dispatch(
      removeBoardAccess(id, { user: { _id: userName } }, token),
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
    setRefresh(true);
  };

  return (
    <form onSubmit={onRemoveUser} className={classes.spacing}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h6'>Remove Board Member</Typography>
          <FormControl
            variant='outlined'
            className={classes.formControl}
            fullWidth>
            <InputLabel id='demo-simple-select-outlined-label'>
              User Names
            </InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              label='User Names'
              name='name'
              id='name'
              defaultValue='none'>
              <MenuItem value='none'>
                <em>None</em>
              </MenuItem>
              {members?.map((member, key) => (
                <MenuItem value={member.userId._id} key={key}>
                  {member.userId.firstName + ' ' + member.userId.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => dispatch(openLoader({ open: true }))}
            type='submit'
            size='small'
            variant='contained'
            color='primary'
            className={classes.buttonRight}>
            {' '}
            Remove Access
          </Button>
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </form>
  );
}
