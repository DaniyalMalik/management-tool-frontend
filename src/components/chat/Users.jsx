import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import socketIOClient from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllUsers,
  getAllUsersByEmployId,
} from '../../actions/actionCreators/userActions';
import { closeLoader } from '../../actions/actionCreators/loaderActions';

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
  avatar: {
    margin: '5px',
  },
}));

const Users = (props) => {
  const classes = useStyles();
  const [newUser, setNewUser] = useState(null);
  const dispatch = useDispatch();
  const { companyUsers, user, token } = useSelector((state) => state.user);
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  const getResponse = async () => {
    if (user?.employId?._id) {
      await dispatch(getAllUsersByEmployId(user.employId._id, token));
      dispatch(closeLoader());
    }

    if (user?.companyId?._id) {
      await dispatch(getAllUsersByEmployId(user.companyId._id, token));
      dispatch(closeLoader());
    }
  };

  useEffect(() => {
    getResponse();
  }, [newUser, user]);

  useEffect(() => {
    socket.on('users', (data) => {
      setNewUser(data);
    });

    return () => {
      socket.removeListener('users');
    };
  }, []);

  return (
    <List className={classes.list}>
      {companyUsers.length > 0 &&
        companyUsers.map(
          (u) =>
            u._id !== user._id && (
              <ListItem
                key={u?._id}
                onClick={() => {
                  props.setUser(u);
                  props.setScope(u?.firstName + ' ' + u?.lastName);
                }}
                button>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar
                    alt={u?.firstName + ' ' + u?.lastName}
                    src={u?.imagePath}>
                    {!u?.imagePath && u?.firstName.split('')[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={u?.firstName + ' ' + u?.lastName} />
              </ListItem>
            ),
        )}
    </List>
  );
};

export default Users;
