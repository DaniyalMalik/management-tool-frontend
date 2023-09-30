import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { updateListById } from '../../actions/actionCreators/listActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
  colorcard: {
    height: '32px',
    width: '20%',
    margin: theme.spacing(0.7),
    borderRadius: theme.spacing(1),
    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    },
  },
  floatRight: {
    float: 'right',
  },
}));

export default function ChangeListColor({
  open,
  toggleDialog,
  currBoard,
  list,
}) {
  const classes = useStyles();
  const colors = [
    'rgb(0, 121, 191)',
    'rgb(210, 144, 52)',
    'rgb(81, 152, 57)',
    'rgb(176, 70, 50)',
    'rgb(137, 96, 158)',
    'rgb(205, 90, 145)',
    '#b2102f',
    '#00bcd4',
    '#009688',
  ];
  const [listTitle, setListTitle] = useState('');
  const [listColor, setListColor] = useState('');
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (list?._id) {
      setListTitle(list.name);
      setListColor(list.color);
    }
  }, [list]);

  const handleChange = (e) => {
    setListTitle(e.target.value);
  };

  const updateHandler = async () => {
    if (listTitle === '' && listColor === '') {
      return;
    }

    const postListReq = {
      name: listTitle,
      color: listColor,
    };

    const res = await dispatch(updateListById(list._id, postListReq, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    setListTitle('');
    setListColor('');
    toggleDialog();
  };

  return (
    <Dialog open={open} onClose={toggleDialog}>
      <DialogTitle>
        <IconButton style={{ float: 'right' }} onClick={toggleDialog}>
          <Close fontSize='small' />
        </IconButton>
        <Typography
          style={{ textAlign: 'center', fontWeight: '600' }}
          variant='h5'>
          Update List
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label='List Title'
          value={listTitle}
          fullWidth
          disabled={currBoard?.type === 'Template' ? true : false}
          onChange={handleChange}
          variant='outlined'
        />
        <div className={classes.cardContainer}>
          {colors.map((color) => (
            <div
              className={classes.colorcard}
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => setListColor(color)}
            />
          ))}
        </div>
        <Button
          className={classes.floatRight}
          color='primary'
          variant='contained'
          size='small'
          onClick={() => {
            dispatch(openLoader({ open: true }));
            updateHandler();
          }}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}
