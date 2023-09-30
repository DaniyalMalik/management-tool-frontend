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
  FormLabel,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoardByIdPut } from '../../actions/actionCreators/boardActions';
import { bulkUpdateList } from '../../actions/actionCreators/listActions';
import { bulkUpdateCard } from '../../actions/actionCreators/cardActions';
import { getAllUsersByEmployId } from '../../actions/actionCreators/userActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
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

export default function AddBoardMember({ componentUpdated }) {
  const classes = useStyles();
  const { token, user, companyUsers } = useSelector((state) => state.user);
  const { currBoard } = useSelector((state) => state.boards);
  const [accessType, setAccessType] = useState('Editor');
  const [accessFor, setAccessFor] = useState('overAll');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const [members, setMembers] = useState([]);

  const getUsers = async () => {
    if (user?.employId?._id) {
      dispatch(getAllUsersByEmployId(user.employId._id, token));
    }

    if (user?.companyId?._id) {
      dispatch(getAllUsersByEmployId(user.companyId._id, token));
    }
  };

  useEffect(() => {
    getUsers();
  }, [token, user]);

  useEffect(() => {
    if (companyUsers.length > 0) {
      let array = companyUsers.filter((u) => u._id !== user._id);

      setMembers(array);
    }
  }, [companyUsers, user]);

  const onAddUser = async (e) => {
    e.preventDefault();

    const userName = e.target.name.value;
    let isAdmin = false;

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
      const data = {
        user: { userId: userName, role: accessType },
      };

      if (accessFor === 'overAll') {
        dispatch(bulkUpdateCard(id, data, token));
        await dispatch(bulkUpdateList(id, data, token));
        const res = await dispatch(updateBoardByIdPut(id, data, token));

        isAdmin = false;

        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());
        componentUpdated();

        if (res?.success) {
          dispatch(
            postNotification(
              {
                title: 'Added in a Board',
                description: 'has just added you to a board!',
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
      } else if (accessFor === 'board') {
        const data = {
          user: { userId: userName, role: 'Editor' },
        };
        const res = await dispatch(updateBoardByIdPut(id, data, token));

        isAdmin = false;

        componentUpdated();

        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());

        if (res?.success) {
          dispatch(
            postNotification(
              {
                title: 'Added in a Board',
                description: 'has just added you to a board!',
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

  const handleChangeAccessType = (event) => {
    setAccessType(event.target.value);
  };

  const handleChangeAccessFor = (event) => {
    setAccessFor(event.target.value);

    if (event.target.value === 'board') {
      setDisabled(true);
      setAccessType('Editor');
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
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
                label='User Names'
                name='name'
                id='name'
                defaultValue='none'>
                <MenuItem value='none'>
                  <em>None</em>
                </MenuItem>
                {members?.map((member, key) => (
                  <MenuItem value={member._id} key={key}>
                    {member.firstName + ' ' + member.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup row className={classes.alignCheckBoxes}>
              <FormLabel component='legend'>Access For:</FormLabel>
              <RadioGroup
                aria-label='Access For'
                name='accessFor'
                value={accessFor}
                style={{ display: 'contents' }}
                onChange={handleChangeAccessFor}>
                <FormControlLabel
                  value='board'
                  control={<Radio />}
                  label='Board'
                />
                <FormControlLabel
                  value='overAll'
                  control={<Radio />}
                  label='OverAll'
                />
              </RadioGroup>
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup row className={classes.alignCheckBoxes}>
              <FormLabel component='legend'>Access Type:</FormLabel>
              <RadioGroup
                aria-label='Access Type'
                name='accessType'
                value={accessType}
                style={{ display: 'contents' }}
                onChange={handleChangeAccessType}>
                <FormControlLabel
                  value='Viewer'
                  disabled={disabled}
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
              onClick={() => dispatch(openLoader({ open: true }))}
              type='submit'
              size='small'
              variant='contained'
              color='primary'
              className={classes.buttonRight}>
              {' '}
              Allow Access
            </Button>
          </Grid>
          <Grid item xs={12} />
        </Grid>
      </form>
    </>
  );
}
