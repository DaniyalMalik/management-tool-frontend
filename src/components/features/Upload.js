import React, { useState } from 'react';
import {
  makeStyles,
  Button,
  TextField,
  Typography,
  InputLabel,
} from '@material-ui/core';
import Images from './Images';
import Files from './Files';
import Videos from './Videos';
import { AttachFile } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { uploadCardAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px',
  },
  buttonRight: {
    float: 'right',
  },
  label: {
    cursor: 'pointer',
    border: '2px solid #183569',
    color: '#183569',
    width: 'fit-content',
    padding: '5px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#183569',
      color: '#ffffff',
    },
  },
  file: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
}));

export default function Upload({ board, componentUpdated, task }) {
  const classes = useStyles();
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState({
    attachment: null,
  });
  const { attachment } = state;
  const dispatch = useDispatch();

  const onChange = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const onUpload = async (e) => {
    e.preventDefault();

    if (!attachment) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Choose Image/File/Video/GIF',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] !== 'video' &&
      attachment?.type.split('/')[0] !== 'image' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large File!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'image' &&
      attachment?.size / 1024 / 1024 > 20
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Image/GIF!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'video' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Video!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    // const url = `/api/file/uploadcardattachment/${task._id}`,
    // const url = `/file/uploadcardattachment/${task._id}?userId=${user._id}`,
    const formData = new FormData();
    // config = {
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //     'x-auth-token': token,
    //   },
    // };
    formData.append('file', attachment);

    // const res = await axios.post(url, formData, config);
    const res = await uploadCardAttachment(
      task?._id,
      board._id,
      formData,
      token,
    );

    if (res?.success) {
      setState({ ...state, attachment: null });
      componentUpdated();
    }

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
  };

  return (
    <>
      <Images task={task} componentUpdated={componentUpdated} />
      <Files task={task} componentUpdated={componentUpdated} />
      <Videos task={task} componentUpdated={componentUpdated} />
      <form className={classes.spacing} onSubmit={onUpload}>
        <Typography variant='h6'>Upload Image/File/Video/GIF</Typography>
        <InputLabel className={classes.label} htmlFor='file'>
          Choose File
          <AttachFile />
        </InputLabel>
        <Typography variant='caption'>{attachment?.name}</Typography>
        <TextField
          className={classes.file}
          type='file'
          id='file'
          name='file'
          onChange={onChange}
        />
        <Button
          onClick={() => dispatch(openLoader({ open: true }))}
          type='submit'
          variant='contained'
          size='small'
          color='primary'
          className={classes.buttonRight}>
          Upload
        </Button>
      </form>
    </>
  );
}
