import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Button,
  ListItem,
  List,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
} from '@material-ui/core';
import {
  SendOutlined,
  ExpandMore,
  AttachFile,
  PublishOutlined,
  Publish,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import backgroundImage from '../../assets/bg_1.png';
import {
  getGroupMessages,
  getConversationMessages,
} from '../../actions/actionCreators/chatActions';
import { closeLoader } from '../../actions/actionCreators/loaderActions';
import ReactTimeAgo from 'react-time-ago';
import { Fab, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ChatInput from './ChatInput';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    backgroundImage: 'url(' + backgroundImage + ')',
  },
  headerRow: {
    maxHeight: 55,
    zIndex: 5,
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    color: theme.palette.primary.dark,
    paddingLeft: '20px',
  },
  messageContainer: {
    height: '100%',
  },
  messagesRow: {
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  newMessageRow: {
    padding: '5px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  form: {
    width: '100%',
  },
  avatar: {
    margin: '5px',
  },
  listItem: {
    width: '100%',
    display: 'flex',
  },
  styledMessage: {
    boxShadow: '1px 1px 3px #000000',
    borderRadius: '5px',
    paddingLeft: '10px',
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingRight: '10px',
  },
  displayRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  floatingButton: {
    position: 'fixed',
    backgroundColor: '#ffffff',
    bottom: '65px',
    right: '20px',
    opacity: '0.5',
    '&:hover': {
      backgroundColor: '#ffffff',
      opacity: '1',
    },
  },
  input: {
    display: 'none',
  },
  cardSize: {
    maxWidth: '300px',
    boxShadow: '1px 1px 3px #000000',
    borderRadius: '5px',
  },
  styledCardContent: {
    padding: '10px !important',
  },
}));

const ChatBox = (props) => {
  const { messages, groupMessages } = useSelector((state) => state.chat);
  const [changed, setChanged] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let chatBottom = useRef(null);
  const classes = useStyles();
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  // const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [changed, props.scope, props.conversationId, token]);

  useEffect(() => {
    socket.on('messages', (data) => {
      (user?._id === data?.from || user?._id === data?.to) &&
        setChanged((prev) => !prev);
    });

    return () => {
      socket.removeListener('messages');
    };
  }, []);

  useEffect(() => {
    socket.on('groupMessages', (data) => {
      (user?._id === data?.from || data?.participants.includes(user?._id)) &&
        setChanged((prev) => !prev);
    });

    return () => {
      socket.removeListener('groupMessages');
    };
  }, []);

  const reloadMessages = async () => {
    if (props?.scope === '') {
      setHidden(true);
    } else if (props?.scope !== null && props?.user?.participants) {
      await dispatch(getGroupMessages(props?.user?._id, token));
      setHidden(false);
      dispatch(closeLoader());
    } else if (props?.scope !== null && !props?.user?.participants) {
      await dispatch(getConversationMessages(props?.user?._id, token));
      setHidden(false);
      dispatch(closeLoader());
    } else {
      setHidden(true);
    }
  };

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || groupMessages.length > 0) {
      scrollToBottom();
    }
  }, [messages, groupMessages]);

  // window.onscroll = function () {
  //   scrollFunction();
  // };

  // function scrollFunction() {
  //   if (
  //     document.body.scrollTop > 20 ||
  //     document.documentElement.scrollTop > 20
  //   ) {
  //     setShowButton(true);
  //   } else {
  //     setShowButton(false);
  //   }
  // }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.headerRow}>
        <Paper className={classes.paper} square elevation={2}>
          {props?.user && <Avatar src={props?.user?.imagePath}></Avatar>}
          &nbsp; &nbsp;
          <Typography variant='body1' color='textPrimary'>
            {props.scope}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.messageContainer}>
          <Grid item xs={12} className={classes.messagesRow}>
            {props?.scope &&
              !hidden &&
              (messages && messages.length > 0 ? (
                <List>
                  {messages.map((m, key) => (
                    <ListItem
                      key={m._id}
                      className={classes.listItem}
                      style={{
                        justifyContent:
                          m?.fromObj[0]?._id === user?._id
                            ? 'flex-end'
                            : 'flex-start',
                      }}>
                      <ListItemAvatar className={classes.avatar}>
                        <Avatar
                          alt={
                            m.fromObj[0]?.firstName +
                            ' ' +
                            m.fromObj[0]?.lastName
                          }
                          src={m.fromObj[0]?.imagePath}>
                          {!m.fromObj[0].imagePath &&
                            m.fromObj[0].firstName.split('')[0]}
                        </Avatar>
                      </ListItemAvatar>
                      {m?.imagePath || m?.filePath || m?.videoPath ? (
                        m?.imagePath ? (
                          <Card className={classes.cardSize}>
                            <CardMedia
                              component='img'
                              alt='image'
                              image={m.imagePath}
                            />
                            <CardContent className={classes.styledCardContent}>
                              <Typography variant='body1' color='textSecondary'>
                                {m.fromObj[0]._id !== user._id
                                  ? m.fromObj[0].firstName +
                                    ' ' +
                                    m.fromObj[0].lastName
                                  : 'Me'}
                              </Typography>
                              <Typography variant='body1' color='textPrimary'>
                                {m?.body}
                              </Typography>
                              <div className={classes.displayRight}>
                                <Typography
                                  color='textSecondary'
                                  variant='subtitle2'
                                  component='span'>
                                  <ReactTimeAgo
                                    date={new Date(
                                      m?.createdAt,
                                    ).toLocaleString()}
                                    locale='en-US'
                                  />
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        ) : m?.filePath ? (
                          <Card className={classes.cardSize}>
                            <CardActionArea>
                              <a
                                href={m.filePath}
                                rel='noopener noreferrer'
                                download='assighment'
                                target='_blank'>
                                <IconButton>
                                  <Typography
                                    variant='body2'
                                    color='textPrimary'>
                                    Download Attachment
                                    <AttachFile fontSize='medium' />
                                  </Typography>
                                </IconButton>
                              </a>
                            </CardActionArea>
                            <CardContent className={classes.styledCardContent}>
                              <Typography variant='body1' color='textSecondary'>
                                {m.fromObj[0]._id !== user._id
                                  ? m.fromObj[0].firstName +
                                    ' ' +
                                    m.fromObj[0].lastName
                                  : 'Me'}
                              </Typography>
                              <Typography variant='body1' color='textPrimary'>
                                {m?.body}
                              </Typography>
                              <div className={classes.displayRight}>
                                <Typography
                                  color='textSecondary'
                                  variant='subtitle2'
                                  component='span'>
                                  <ReactTimeAgo
                                    date={new Date(
                                      m?.createdAt,
                                    ).toLocaleString()}
                                    locale='en-US'
                                  />
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className={classes.cardSize}>
                            <CardContent className={classes.styledCardContent}>
                              <video controls style={{ padding: '10px' }}>
                                <source
                                  src={`${m.videoPath}?w=200&h=200&fit=crop&auto=format`}
                                  srcSet={`${m.videoPath}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                                  loading='lazy'
                                />
                              </video>
                              <Typography variant='body1' color='textSecondary'>
                                {m.fromObj[0]._id !== user._id
                                  ? m.fromObj[0].firstName +
                                    ' ' +
                                    m.fromObj[0].lastName
                                  : 'Me'}
                              </Typography>
                              <Typography variant='body1' color='textPrimary'>
                                {m?.body}
                              </Typography>
                              <div className={classes.displayRight}>
                                <Typography
                                  color='textSecondary'
                                  variant='subtitle2'
                                  component='span'>
                                  <ReactTimeAgo
                                    date={new Date(
                                      m?.createdAt,
                                    ).toLocaleString()}
                                    locale='en-US'
                                  />
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      ) : (
                        <div className={classes.styledMessage}>
                          <ListItemText
                            primary={
                              <Typography variant='body1' color='textSecondary'>
                                {m.fromObj[0]._id !== user._id
                                  ? m.fromObj[0].firstName +
                                    ' ' +
                                    m.fromObj[0].lastName
                                  : 'Me'}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant='body1' color='textPrimary'>
                                  {m?.body}
                                </Typography>
                                <div className={classes.displayRight}>
                                  <Typography
                                    color='textSecondary'
                                    variant='subtitle2'
                                    component='span'>
                                    <ReactTimeAgo
                                      date={new Date(
                                        m?.createdAt,
                                      ).toLocaleString()}
                                      locale='en-US'
                                    />
                                  </Typography>
                                </div>
                              </>
                            }
                          />
                        </div>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List>
                  {groupMessages &&
                    groupMessages.length > 0 &&
                    groupMessages.map((m) => (
                      <ListItem
                        key={m._id}
                        className={classes.listItem}
                        style={{
                          justifyContent:
                            m?.from?._id === user?._id
                              ? 'flex-end'
                              : 'flex-start',
                        }}>
                        <ListItemAvatar className={classes.avatar}>
                          <Avatar
                            alt={m.from.firstName + ' ' + m.from.lastName}
                            src={m.from.imagePath}>
                            {!m.from.imagePath && m.from.firstName.split('')[0]}
                          </Avatar>
                        </ListItemAvatar>
                        {m?.imagePath || m?.filePath || m?.videoPath ? (
                          m?.imagePath ? (
                            <Card className={classes.cardSize}>
                              <CardMedia
                                component='img'
                                alt='image'
                                image={m.imagePath}
                              />
                              <CardContent
                                className={classes.styledCardContent}>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
                                  {m.from._id !== user._id
                                    ? m.from.firstName + ' ' + m.from.lastName
                                    : 'Me'}
                                </Typography>
                                <Typography variant='body1' color='textPrimary'>
                                  {m?.body}
                                </Typography>
                                <div className={classes.displayRight}>
                                  <Typography
                                    color='textSecondary'
                                    variant='subtitle2'
                                    component='span'>
                                    <ReactTimeAgo
                                      date={new Date(
                                        m?.createdAt,
                                      ).toLocaleString()}
                                      locale='en-US'
                                    />
                                  </Typography>
                                </div>
                              </CardContent>
                            </Card>
                          ) : m?.filePath ? (
                            <Card className={classes.cardSize}>
                              <CardActionArea>
                                <a
                                  href={m.filePath}
                                  rel='noopener noreferrer'
                                  download='assighment'
                                  target='_blank'>
                                  <IconButton>
                                    <Typography
                                      variant='body2'
                                      color='textPrimary'>
                                      Download Attachment
                                      <AttachFile fontSize='medium' />
                                    </Typography>
                                  </IconButton>
                                </a>
                              </CardActionArea>
                              <CardContent
                                className={classes.styledCardContent}>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
                                  {m.from._id !== user._id
                                    ? m.from.firstName + ' ' + m.from.lastName
                                    : 'Me'}
                                </Typography>
                                <Typography variant='body1' color='textPrimary'>
                                  {m?.body}
                                </Typography>
                                <div className={classes.displayRight}>
                                  <Typography
                                    color='textSecondary'
                                    variant='subtitle2'
                                    component='span'>
                                    <ReactTimeAgo
                                      date={new Date(
                                        m?.createdAt,
                                      ).toLocaleString()}
                                      locale='en-US'
                                    />
                                  </Typography>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className={classes.cardSize}>
                              <CardContent
                                className={classes.styledCardContent}>
                                <video controls style={{ padding: '10px' }}>
                                  <source
                                    src={`${m.videoPath}?w=200&h=200&fit=crop&auto=format`}
                                    srcSet={`${m.videoPath}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                                    loading='lazy'
                                  />
                                </video>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
                                  {m.from._id !== user._id
                                    ? m.from.firstName + ' ' + m.from.lastName
                                    : 'Me'}
                                </Typography>
                                <Typography variant='body1' color='textPrimary'>
                                  {m?.body}
                                </Typography>
                                <div className={classes.displayRight}>
                                  <Typography
                                    color='textSecondary'
                                    variant='subtitle2'
                                    component='span'>
                                    <ReactTimeAgo
                                      date={new Date(
                                        m?.createdAt,
                                      ).toLocaleString()}
                                      locale='en-US'
                                    />
                                  </Typography>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        ) : (
                          <div className={classes.styledMessage}>
                            <ListItemText
                              primary={
                                m.from._id !== user._id
                                  ? m.from.firstName + ' ' + m.from.lastName
                                  : 'Me'
                              }
                              secondary={
                                <>
                                  <div>{m?.body}</div>
                                </>
                              }
                            />
                          </div>
                        )}
                      </ListItem>
                    ))}
                </List>
              ))}
            <div ref={chatBottom} />
          </Grid>
          {!hidden && (
            <LightTooltip
              title='Scroll to bottom'
              onClick={() => scrollToBottom()}>
              <Fab className={classes.floatingButton}>
                <ExpandMore color='primary' />
              </Fab>
            </LightTooltip>
          )}
          <Grid item xs={12} className={classes.inputRow}>
            {!hidden && <ChatInput props={props} />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatBox;
