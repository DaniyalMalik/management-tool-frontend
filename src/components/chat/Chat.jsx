import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import Tab from '@material-ui/core/Tab';
import ChatBox from './ChatBox';
import Conversations from './Conversations';
import Users from './Users';
import { openLoader } from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: 'calc(100vh - 64px)',
    // minHeight: '95vh',
    borderRadius: 0,
  },
  sidebar: {
    zIndex: 5,
  },
  height: {
    height: 55,
  },
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
  // marginTop: {
  //   marginTop: '30px',
  // },
}));

export const Chat = () => {
  const [scope, setScope] = useState('');
  const [tab, setTab] = useState(0);
  const { companyUsers, token } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [convo, setConvo] = useState(null);
  const classes = useStyles();
  const { groups, conversations } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleChange = (e, newVal) => {
    setTab(newVal);
  };

  return (
    <>
      <Grid container className={classes.marginTop}>
        <Grid item md={4} className={classes.sidebar}>
          <Paper className={classes.paper} square elevation={5}>
            <Paper square className={classes.height}>
              <Tabs
                className={classes.height}
                onChange={handleChange}
                variant='fullWidth'
                value={tab}
                indicatorColor='primary'
                textColor='primary'>
                <Tab
                  label='Chats'
                  className={classes.height}
                  onClick={() =>
                    (groups.length === 0 || conversations.length === 0) &&
                    dispatch(openLoader({ open: true }))
                  }
                />
                <Tab
                  label='Users'
                  className={classes.height}
                  onClick={() =>
                    companyUsers.length === 0 &&
                    dispatch(openLoader({ open: true }))
                  }
                />
              </Tabs>
            </Paper>
            {tab === 0 && (
              <Conversations
                setUser={setUser}
                setConvo={setConvo}
                setScope={setScope}
                convo={convo}
                user={user}
              />
            )}
            {tab === 1 && <Users setUser={setUser} setScope={setScope} />}
          </Paper>
        </Grid>
        <Grid item md={8}>
          <ChatBox scope={scope} user={user} convo={convo} />
        </Grid>
      </Grid>
    </>
  );
};
