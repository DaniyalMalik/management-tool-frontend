import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SendOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  List,
  ListItemText,
  Grid,
  TextField,
  ListItemAvatar,
  Avatar,
  ListItem,
  Typography,
} from '@material-ui/core';
import socketIOClient from 'socket.io-client';
import {
  getComments,
  addComment,
} from '../../actions/actionCreators/commentActions';
import { postNotification } from '../../actions/actionCreators/notificationActions';
import { updateCardByIdPut } from '../../actions/actionCreators/cardActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px',
  },
  styledMessage: {
    backgroundColor: '#ffffff',
    boxShadow: '1px 1px 2px #000000',
    color: '#000000',
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: '5px',
  },
  listItem: {
    width: '100%',
    display: 'flex',
  },
}));

export default function Comment({ card, componentUpdated }) {
  const classes = useStyles();
  const [newComment, setNewComment] = useState('');
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  const { user, token } = useSelector((state) => state.user);
  let chatBottom = useRef(null);
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  useEffect(() => {
    socket.on('comment', (data) => {
      if (data.from !== user?._id) {
        setRefresh(true);
      }
    });

    return () => {
      socket.removeListener('comment');
    };
  }, []);

  const getResponse = async () => {
    setRefresh(false);

    dispatch(getComments(card._id, token));
    await scrollToBottom();
  };

  useEffect(() => {
    if (token) {
      getResponse();
    }
  }, [token, refresh]);

  useEffect(() => {
    if (comments.length > 0) {
      return scrollToBottom();
    }
  }, [comments]);

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(
      addComment({ from: user._id, body: newComment, cardId: card._id }, token),
    );

    if (res?.success && !card?.commentId) {
      const res2 = await dispatch(
        updateCardByIdPut(card._id, { commentId: res?.comment?._id }, token),
      );

      if (res2?.success) {
        componentUpdated();
      }
    }

    if (res?.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());

      const assignees = [];

      card.user.map(
        (u) =>
          u?.userId._id != user?._id &&
          assignees.push({ userId: u?.userId._id }),
      );

      dispatch(
        postNotification(
          {
            title: 'Added Comment',
            description: 'has just commented in a card!',
            companyId: user?.companyId?._id
              ? user.companyId._id
              : user?.employId?._id,
            from: user?._id,
            for: assignees,
          },
          token,
        ),
      );

      setNewComment('');
    } else {
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

  return (
    <>
      <Grid item xs={12}>
        <Grid container className={classes.messageContainer}>
          <Grid item xs={12} className={classes.messagesRow}>
            {comments && comments.length > 0 && (
              <List>
                {comments.map((comment) => (
                  <ListItem
                    key={comment._id}
                    className={classes.listItem}
                    style={{
                      justifyContent:
                        comment?.from?._id === user?._id
                          ? 'flex-end'
                          : 'flex-start',
                    }}>
                    <ListItemAvatar className={classes.avatar}>
                      <Avatar
                        alt={
                          comment.from.firstName + ' ' + comment.from.lastName
                        }
                        src={comment.from.imagePath}>
                        {!comment.from.imagePath &&
                          comment.from.firstName.split('')[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <div className={classes.styledMessage}>
                      <ListItemText
                        primary={
                          <Typography variant='body1' color='textSecondary'>
                            {comment.from._id !== user.id
                              ? comment.from.firstName +
                                ' ' +
                                comment.from.lastName
                              : 'Me'}
                          </Typography>
                        }
                        secondary={
                          <Typography variant='body1' color='textPrimary'>
                            {comment?.body}
                          </Typography>
                        }
                      />
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
            <div ref={chatBottom} />
          </Grid>
          <Grid item xs={12} className={classes.inputRow}>
            <form onSubmit={handleSubmit} className={classes.form}>
              <Grid
                container
                className={classes.newMessageRow}
                alignItems='flex-end'>
                <Grid item xs={11}>
                  <TextField
                    id='comment'
                    label='Comment'
                    variant='outlined'
                    margin='dense'
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    type='submit'
                    onClick={() => dispatch(openLoader({ open: true }))}>
                    <SendOutlined color='primary' />
                  </IconButton>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
