import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import { SendOutlined, AttachFile } from '@material-ui/icons';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { useDispatch, useSelector } from 'react-redux';
import {
  postGroupMessage,
  postConversationMessage,
} from '../../actions/actionCreators/chatActions';
import {
  sendGroupAttachment,
  uploadMessageAttachment,
} from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  closeLoader,
  openLoader,
} from '../../actions/actionCreators/loaderActions';
import socketIOClient from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
  newMessageRow: {
    padding: '5px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function ChatInput({ props }) {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const [state, setState] = useState({
    attachment: null,
  });
  const { attachment } = state;
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (/^\s/.test(newMessage)) {
      return dispatch(
        openSnackbar({
          open: true,
          message: 'Enter message!',
          severity: false,
        }),
      );
    }

    if (!newMessage) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter message!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (props?.scope !== null && props?.user?.participants) {
      let data = {
        from: user?._id,
        body: newMessage,
      };

      if (!attachment) {
        dispatch(
          postGroupMessage(
            props?.convo._id,
            data,
            props?.convo.from._id !== user?._id ? true : false,
            token,
          ),
        ).then((res) => {
          setNewMessage('');
          dispatch(closeLoader());

          if (res?.success) {
            const assignees = [];

            props.user.participants.map(
              (p) => p != user?._id && assignees.push({ userId: p }),
            );

            dispatch(
              postNotification(
                {
                  title: 'New Group Message',
                  description: 'has just sent you a message in a group!',
                  companyId: user?.companyId?._id
                    ? user.companyId._id
                    : user?.employId?._id,
                  from: user?._id,
                  for: assignees,
                },
                token,
              ),
            );
          }
        });
      } else {
        const formData = new FormData();
        let fileType = attachment?.type.split('/')[0];

        fileType !== 'video' && fileType !== 'image' && (fileType = 'file');
        formData.append('file', attachment);

        dispatch(
          sendGroupAttachment(
            formData,
            props?.convo._id,
            user?._id,
            newMessage,
            props?.convo.from._id !== user?._id ? true : false,
            fileType,
            'group',
            token,
          ),
        ).then((res) => {
          setNewMessage('');
          setState({ ...state, attachment: null });
          dispatch(closeLoader());

          if (res?.success) {
            const assignees = [];

            props.user.participants.map(
              (p) => p != user?._id && assignees.push({ userId: p }),
            );

            dispatch(
              postNotification(
                {
                  title: 'New Group Message',
                  description: 'has just sent you a message in a group!',
                  companyId: user?.companyId?._id
                    ? user.companyId._id
                    : user?.employId?._id,
                  from: user?._id,
                  for: assignees,
                },
                token,
              ),
            );
          }
        });
      }
    } else {
      let data = {
        to: props?.user?._id,
        body: newMessage,
        from: user?._id,
      };

      if (!attachment) {
        postConversationMessage(
          props?.convo._id,
          props?.convo.from._id !== user?._id ? true : false,
          data,
          token,
        ).then((res) => {
          setNewMessage('');
          dispatch(closeLoader());

          if (res?.success) {
            dispatch(
              postNotification(
                {
                  title: 'New Message',
                  description: 'has just sent you a message!',
                  companyId: user?.companyId?._id
                    ? user.companyId._id
                    : user?.employId?._id,
                  from: user?._id,
                  for: { userId: props?.user?._id },
                },
                token,
              ),
            );
          }
        });
      } else {
        const formData = new FormData();
        let fileType = attachment?.type.split('/')[0];

        fileType !== 'video' && fileType !== 'image' && (fileType = 'file');
        formData.append('file', attachment);

        uploadMessageAttachment(
          formData,
          props?.convo._id,
          props?.convo.from._id !== user?._id ? true : false,
          props?.user?._id,
          newMessage,
          user?._id,
          fileType,
          'message',
          token,
        ).then((res) => {
          setNewMessage('');
          setState({ ...state, attachment: null });
          dispatch(closeLoader());

          if (res?.success) {
            dispatch(
              postNotification(
                {
                  title: 'New Message',
                  description: 'has just sent you a message!',
                  companyId: user?.companyId?._id
                    ? user.companyId._id
                    : user?.employId?._id,
                  from: user?._id,
                  for: { userId: props?.user?._id },
                },
                token,
              ),
            );
          }
        });
      }
    }
  };

  const onChange = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const onMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.newMessageRow}>
        <TextField
          id='message'
          color='primary'
          label='Enter message'
          placeholder='Enter message...'
          size='small'
          variant='outlined'
          fullWidth
          value={newMessage}
          onChange={onMessageChange}
        />
        <div>
          <TextField
            className={classes.input}
            id='icon-button'
            onChange={onChange}
            type='file'
            name='file'
          />
          <label htmlFor='icon-button'>
            <IconButton component='span'>
              <AttachFile
                color='primary'
                style={{
                  backgroundColor: attachment ? '#183569' : '',
                  color: attachment ? '#ffffff' : '183569',
                  borderRadius: '4px',
                }}
              />
            </IconButton>
          </label>
        </div>
        <IconButton
          type='submit'
          onClick={() => attachment && dispatch(openLoader({ open: true }))}>
          <SendOutlined color='primary' />
        </IconButton>
      </div>
    </form>
  );
}
