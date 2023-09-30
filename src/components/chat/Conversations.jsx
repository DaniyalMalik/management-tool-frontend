import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  Badge,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@material-ui/core';
import { GroupAddOutlined, GroupOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeLoader,
  openLoader,
} from '../../actions/actionCreators/loaderActions';
import {
  updateGroup,
  getConversations,
  updateConversation,
  getGroupConversations,
} from '../../actions/actionCreators/chatActions';
import CreateGroup from './CreateGroup';

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  mediumAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Conversations = (props) => {
  const classes = useStyles();
  const [convoChange_1, setConvoChange_1] = useState(false);
  const [convoChange_2, setConvoChange_2] = useState(false);
  const [groupChange_1, setGroupChange_1] = useState(false);
  const [groupChange_2, setGroupChange_2] = useState(false);
  const { groups, conversations } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [messageRefresh, setMessageRefresh] = useState(false);
  const [groupRefresh, setGroupRefresh] = useState(false);
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  useEffect(() => {
    (groups.length === 0 || conversations.length === 0) &&
      dispatch(openLoader({ open: true }));
  }, []);

  const getGroupsResponse = async (e) => {
    if (user?._id) {
      const res = await dispatch(getGroupConversations(user._id, token));

      if (res?.success) {
        setGroupChange_2((prev) => !prev);
      }

      dispatch(closeLoader());
    }

    setGroupRefresh(false);
  };

  const getConversationsResponse = async (e) => {
    if (user?._id) {
      const res = await dispatch(getConversations(user?._id, token));

      if (res?.success) {
        setConvoChange_2((prev) => !prev);
      }

      dispatch(closeLoader());
    }

    setMessageRefresh(false);
  };

  useEffect(() => {
    if (conversations?.length > 0 && props?.convo) {
      conversations.map(
        (convo) => convo._id === props.convo._id && props.setConvo(convo),
      );
    }
  }, [convoChange_2]);

  useEffect(() => {
    if (groups?.length > 0 && props?.convo) {
      groups.map(
        (group) => group._id === props.convo._id && props.setConvo(group),
      );
    }
  }, [groupChange_2]);

  useEffect(() => {
    getConversationsResponse();
  }, [convoChange_1, token, messageRefresh, user]);

  useEffect(() => {
    getGroupsResponse();
  }, [groupChange_1, token, user, groupRefresh]);

  useEffect(() => {
    socket.on(
      'messages',
      (data) =>
        (user?._id === data?.from || user?._id === data?.to) &&
        setConvoChange_1((prev) => !prev),
    );

    return () => {
      socket.removeListener('messages');
    };
  }, []);

  useEffect(() => {
    socket.on('groupMessages', (data) => {
      (user?._id === data?.from || data?.participants.includes(user?._id)) &&
        setGroupChange_1((prev) => !prev);
    });

    return () => {
      socket.removeListener('groupMessages');
    };
  }, []);

  useEffect(() => {
    socket.on('groups', (data) => {
      (user?._id === data?.from || data?.participants.includes(user?._id)) &&
        setGroupChange_1((prev) => !prev);
    });

    return () => {
      socket.removeListener('groups');
    };
  }, []);

  const handleModal = (e) => {
    setOpen(!open);
  };

  return (
    <>
      {open && <CreateGroup handleModal={handleModal} open={open} />}
      <List className={classes.list}>
        <ListItem
          classes={{ root: classes.subheader }}
          onClick={() => {
            setOpen(!open);
          }}>
          <ListItemAvatar>
            <Avatar className={classes.globe}>
              <GroupAddOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className={classes.subheaderText}
            primary='Create Group'
          />
        </ListItem>
        <Divider />
        {(conversations.length > 0 || groups.length > 0) && (
          <>
            {conversations.map(
              (c) =>
                (user?.employId || user?.companyId) &&
                (c?.from?._id != user?._id && !c.read ? (
                  <ListItem
                    className={classes.listItem}
                    key={c._id}
                    button
                    onClick={() => {
                      !props?.user?._id && dispatch(openLoader({ open: true }));
                      props?.user?._id !== c.recipients[1]._id &&
                        props?.user?._id !== c.recipients[0]._id &&
                        dispatch(openLoader({ open: true }));
                      dispatch(updateConversation(c._id, token));
                      props.setUser(
                        c.recipients[0]._id == user._id
                          ? c.recipients[1]
                          : c.recipients[0],
                      );
                      props.setConvo(c);
                      props.setScope(
                        c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName +
                              ' ' +
                              c.recipients[1].lastName
                          : c.recipients[0].firstName +
                              ' ' +
                              c.recipients[0].lastName,
                      );
                      setMessageRefresh(true);
                    }}>
                    <ListItemAvatar>
                      <Avatar
                        alt={
                          c.recipients[0]._id == user._id
                            ? c.recipients[1].firstName +
                              ' ' +
                              c.recipients[1].lastName
                            : c.recipients[0].firstName +
                              ' ' +
                              c.recipients[0].lastName
                        }
                        src={
                          c.recipients[0]._id == user._id
                            ? c.recipients[1].imagePath
                            : c.recipients[0].imagePath
                        }>
                        {c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName.split('')[0]
                          : c.recipients[0].firstName.split('')[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName +
                            ' ' +
                            c.recipients[1].lastName
                          : c.recipients[0].firstName +
                            ' ' +
                            c.recipients[0].lastName
                      }
                      secondary={<>{c.lastMessage}</>}
                    />
                    <Badge color='primary' badgeContent={c?.newMessagesCount} />
                  </ListItem>
                ) : (
                  <ListItem
                    className={classes.listItem}
                    key={c._id}
                    button
                    onClick={() => {
                      !props?.user?._id && dispatch(openLoader({ open: true }));
                      props?.user?._id !== c.recipients[1]._id &&
                        props?.user?._id !== c.recipients[0]._id &&
                        dispatch(openLoader({ open: true }));
                      dispatch(updateConversation(c._id, token));
                      props.setUser(
                        c.recipients[0]._id == user._id
                          ? c.recipients[1]
                          : c.recipients[0],
                      );
                      props.setConvo(c);
                      props.setScope(
                        c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName +
                              ' ' +
                              c.recipients[1].lastName
                          : c.recipients[0].firstName +
                              ' ' +
                              c.recipients[0].lastName,
                      );
                      setMessageRefresh(true);
                    }}>
                    <ListItemAvatar>
                      <Avatar
                        alt={
                          c.recipients[0]._id == user._id
                            ? c.recipients[1].firstName +
                              ' ' +
                              c.recipients[1].lastName
                            : c.recipients[0].firstName +
                              ' ' +
                              c.recipients[0].lastName
                        }
                        src={
                          c.recipients[0]._id == user._id
                            ? c.recipients[1].imagePath
                            : c.recipients[0].imagePath
                        }>
                        {c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName.split('')[0]
                          : c.recipients[0].firstName.split('')[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        c.recipients[0]._id == user._id
                          ? c.recipients[1].firstName +
                            ' ' +
                            c.recipients[1].lastName
                          : c.recipients[0].firstName +
                            ' ' +
                            c.recipients[0].lastName
                      }
                      secondary={<>{c.lastMessage}</>}
                    />
                  </ListItem>
                )),
            )}
            {groups.map(
              (group) =>
                (user?.employId || user?.companyId) &&
                (group?.from?._id != user?._id && !group.read ? (
                  <ListItem
                    className={classes.listItem}
                    key={group._id}
                    button
                    onClick={() => {
                      !props?.user?._id && dispatch(openLoader({ open: true }));
                      props?.user?._id &&
                        props?.user?._id !== group?._id &&
                        dispatch(openLoader({ open: true }));
                      dispatch(updateGroup(group._id, token));
                      props.setUser(group);
                      props.setConvo(group);
                      props.setScope(group.name);
                      setGroupRefresh(true);
                    }}>
                    <ListItemAvatar>
                      <Avatar alt={group?.name} src={group?.imagePath}>
                        {!group?.imagePath && <GroupOutlined />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={group.name}
                      secondary={<>{group.lastMessage}</>}
                    />
                    <Badge
                      color='primary'
                      badgeContent={group?.newMessagesCount}
                    />
                  </ListItem>
                ) : (
                  <ListItem
                    className={classes.listItem}
                    key={group._id}
                    button
                    onClick={() => {
                      !props?.user?._id && dispatch(openLoader({ open: true }));
                      props?.user?._id &&
                        props?.user?._id !== group?._id &&
                        dispatch(openLoader({ open: true }));
                      dispatch(updateGroup(group._id, token));
                      props.setUser(group);
                      props.setConvo(group);
                      props.setScope(group.name);
                      setGroupRefresh(true);
                    }}>
                    <ListItemAvatar>
                      <Avatar alt={group?.name} src={group?.imagePath}>
                        {!group?.imagePath && <GroupOutlined />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={group.name}
                      secondary={<>{group.lastMessage}</>}
                    />
                  </ListItem>
                )),
            )}
          </>
        )}
      </List>
    </>
  );
};

export default Conversations;
