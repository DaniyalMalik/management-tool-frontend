import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../Utilities/Loader';
import {
  Badge,
  ListItem,
  Divider,
  List,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Group } from '@material-ui/icons';
import ChatApp from '../chat/ChatApp';
import {
  getConversations,
  updateGroup,
  getGroupConversations,
  updateConversation,
} from '../../actions/actionCreators/chatActions';

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
    maxHeight: '350px',
    height: '350px',
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

export default function DashboardChat() {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const { groups, conversations } = useSelector((state) => state.chat);
  const [messageRefresh, setMessageRefresh] = useState(false);
  const dispatch = useDispatch();
  const [groupRefresh, setGroupRefresh] = useState(false);
  const [loader, setLoader] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const getGroupsResponse = (e) => {
    if (token && user?._id) {
      dispatch(getGroupConversations(user._id, token));
    }

    setGroupRefresh(false);
    setLoader(false);
    setRefresh(false);
  };

  const getConversationsResponse = async (e) => {
    if (token && user?._id) {
      dispatch(getConversations(user._id, token));

      // if (res?.conversations?.length > 0) {
      //   let array = res?.conversations;

      //   array.reverse();

      //   setConversations(array);
      // }

      setMessageRefresh(false);
      setLoader(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    getConversationsResponse();
  }, [token, messageRefresh, user, refresh]);

  useEffect(() => {
    getGroupsResponse();
  }, [token, user, groupRefresh, refresh]);

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <List className={classes.list}>
        <ChatApp modalOpen={modalOpen} handleModal={handleModal} />
        {loader ? <Loader open={loader} /> : null}
        {conversations.length > 0 || groups.length > 0 ? (
          <>
            {conversations.map(
              (c) =>
                (user?.employId || user?.companyId) &&
                (c?.from?._id !== user?._id && !c?.read ? (
                  <>
                    <Divider />
                    <ListItem
                      className={classes.listItem}
                      key={c?._id}
                      button
                      onClick={() => {
                        dispatch(updateConversation(c._id, token));
                        setMessageRefresh(true);
                        handleModal();
                      }}>
                      <ListItemAvatar>
                        <Avatar
                          alt={
                            c?.recipients[0]?._id === user?._id
                              ? c?.recipients[1]?.firstName +
                                ' ' +
                                c?.recipients[1]?.lastName
                              : c?.recipients[0]?.firstName +
                                ' ' +
                                c?.recipients[0]?.lastName
                          }
                          src={
                            c?.recipients[0]?._id === user?._id
                              ? c?.recipients[1]?.imagePath
                              : c?.recipients[0]?.imagePath
                          }>
                          {!c?.recipients[0]?._id === user?._id
                            ? c?.recipients[1]?.imagePath
                            : c?.recipients[0]?.imagePath &&
                              c?.recipients[1]?.firstName.split('')[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          c?.recipients[0]?._id === user?._id
                            ? c?.recipients[1]?.firstName +
                              ' ' +
                              c?.recipients[1]?.lastName
                            : c?.recipients[0]?.firstName +
                              ' ' +
                              c?.recipients[0]?.lastName
                        }
                        secondary={<>{c?.lastMessage}</>}
                      />
                      <Badge color='primary' badgeContent=' ' />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <Divider />
                    <ListItem
                      className={classes.listItem}
                      key={c?._id}
                      button
                      onClick={() => {
                        dispatch(updateConversation(c._id, token));
                        setMessageRefresh(true);
                        handleModal();
                      }}>
                      <ListItemAvatar>
                        <Avatar
                          alt={
                            c?.recipients[0]?._id === user?._id
                              ? c?.recipients[1]?.firstName +
                                ' ' +
                                c?.recipients[1]?.lastName
                              : c?.recipients[0]?.firstName +
                                ' ' +
                                c?.recipients[0]?.lastName
                          }
                          src={
                            c?.recipients[0]?._id === user?._id
                              ? c?.recipients[1]?.imagePath
                              : c?.recipients[0]?.imagePath
                          }>
                          {!c?.recipients[0]?._id === user?._id
                            ? c?.recipients[1]?.imagePath
                            : c?.recipients[0]?.imagePath &&
                              c?.recipients[1]?.firstName.split('')[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          c?.recipients[0]?._id === user?._id
                            ? c?.recipients[1]?.firstName +
                              ' ' +
                              c?.recipients[1]?.lastName
                            : c?.recipients[0]?.firstName +
                              ' ' +
                              c?.recipients[0]?.lastName
                        }
                        secondary={<>{c?.lastMessage}</>}
                      />
                    </ListItem>
                  </>
                )),
            )}
            {groups.map(
              (group) =>
                (user?.employId || user?.companyId) &&
                (group?.from?._id !== user?._id && !group?.read ? (
                  <>
                    <Divider />
                    <ListItem
                      className={classes.listItem}
                      key={group?._id}
                      button
                      onClick={() => {
                        dispatch(updateGroup(group._id, token));
                        setGroupRefresh(true);
                        handleModal();
                      }}>
                      <ListItemAvatar>
                        {/* <Avatar alt={group.name} src={group.imagePath}>
                    {!group.imagePath && group.name.split('')[0]}
                    </Avatar> */}
                        <Avatar>
                          <Group />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={group.name}
                        secondary={<>{group.lastMessage}</>}
                      />
                      <Badge color='primary' badgeContent=' ' />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <Divider />
                    <ListItem
                      className={classes.listItem}
                      key={group?._id}
                      button
                      onClick={() => {
                        dispatch(updateGroup(group._id, token));
                        setGroupRefresh(true);
                        handleModal();
                      }}>
                      <ListItemAvatar>
                        {/* <Avatar alt={group.name} src={group.imagePath}>
                      {!group.imagePath && group.name.split('')[0]}
                    </Avatar> */}
                        <Avatar>
                          <Group />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={group?.name}
                        secondary={<>{group?.lastMessage}</>}
                      />
                    </ListItem>
                  </>
                )),
            )}
          </>
        ) : (
          <Typography variant='h6' style={{ textAlign: 'center' }}>
            Inbox is empty!
          </Typography>
        )}
      </List>
    </>
  );
}
