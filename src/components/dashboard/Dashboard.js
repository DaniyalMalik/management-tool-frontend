import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardChat from './DashboardChat';
import Templates from '../board/Templates';
import {
  Paper,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  List,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { fetchAllBoards } from '../../actions/actionCreators/boardActions';
import { createNewActivity } from '../../actions/actionCreators/activityActions';
import { Add, Remove, ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TasksListDashboard from '../task/TasksListDashboard';
import TodayTasksListDashboard from '../task/TodayTasksListDashboard';
import MeetingsListDashboard from '../meeting/MeetingsListDashboard';
import TodoListDashboard from '../todolist/TodoListDashboard';
import TaskProgressDashboard from '../task/TaskProgressDashboard';
import CreateNewBoard from '../board/CreateNewBoard';
import InvitedBoards from '../board/InvitedBoards';
import PersonalBoards from '../board/PersonalBoards';
import Favourites from '../board/Favourites';
import { animated, useSpring } from 'react-spring';
import AppBarDrawer from '../headers/AppBarDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paddingTop_1: {
    paddingTop: '20px',
    overflowX: 'hidden',
    width: '95vw',
    scrollBehavior: 'smooth',
  },
  paddingTop_2: {
    paddingTop: '20px',
  },
  croot: {
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    [theme.breakpoints.up('xl')]: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  },
  floatRight: {
    float: 'right',
  },
  alignChatHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styledSearchBox: {
    zIndex: '1201',
    position: 'fixed',
    top: '15px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  styledFab1: {
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      backgroundColor: '#9e9e9e',
      opacity: '0.5',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
    [theme.breakpoints.up('xl')]: {
      display: 'none',
    },
  },
  styledFab2: {
    position: 'fixed',
    right: '30px',
    bottom: '30px',
    backgroundColor: '#9e9e9e',
    opacity: '0.5',
  },
  styledCards: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  leftIcon: {
    position: 'absolute',
    left: '0',
    top: '15%',
    zIndex: '1',
    opacity: '0.5',
    backgroundColor: '#ffffff',
    '&:hover': {
      opacity: '1',
      backgroundColor: '#ffffff',
    },
  },
  rightIcon: {
    position: 'absolute',
    right: '0',
    top: '15%',
    opacity: '0.5',
    zIndex: '1',
    backgroundColor: '#ffffff',
    '&:hover': {
      opacity: '1',
      backgroundColor: '#ffffff',
    },
  },
  searchBox: {
    width: '600px',
    backgroundColor: '#f1f1f1',
    [theme.breakpoints.down('sm')]: {
      width: '200px',
    },
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [updateBoards, setBoardsUpdate] = useState(false);
  const [updateInvited, setInvitedUpdate] = useState(false);
  const classes = useStyles();
  const { boards, newBoard } = useSelector((state) => state.boards);
  const { token, isValid, user, tokenRequest } = useSelector(
    (state) => state.user,
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const props = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    transitionDuration: '0.3s',
    from: { opacity: 0, transform: 'translateY(-20px)' },
  });

  const handleUpdated = () => {
    setUpdated(!updated);
  };

  const updateInvitedBoards = () => {
    setInvitedUpdate(!updateInvited);
  };

  const updatePersonalBoards = () => {
    setBoardsUpdate(!updateBoards);
  };

  const toggleCreateBoard = () => {
    setOpenCreate(!openCreate);
  };

  const handleChatBoxOpen = () => {
    setChatBoxOpen(!chatBoxOpen);
  };

  useEffect(() => {
    if (isValid && token) {
      dispatch(fetchAllBoards(token));
    }

    setRefresh(false);
  }, [token, isValid, dispatch, refresh]);

  const getResponse = async () => {
    let token = localStorage.getItem('bizstruc-token');

    if (!token) {
      localStorage.removeItem('bizstruc-token');

      token = '';

      return history.push('/');
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    if (token && user?._id && newBoard) {
      dispatch(
        createNewActivity(
          {
            text: `${
              user?.firstName + ' ' + user?.lastName
            } created this board`,
            boardId: newBoard._id,
          },
          token,
        ),
      );
    }
  }, [newBoard, dispatch, token, user]);

  const scrollRight = () => {
    document.getElementById('container').scrollLeft -= 300;
  };

  const scrollLeft = () => {
    document.getElementById('container').scrollLeft += 300;
  };

  return (
    <AppBarDrawer
      component={
        <>
          <animated.div style={props}>
            <div className={classes.root}>
              <div className={classes.troot}>
                <Grid container spacing={3}>
                  <Grid item md={12} lg={12} xs={12} sm={9}>
                    {(isValid || tokenRequest) && (
                      <div>
                        <div id='container' className={classes.paddingTop_1}>
                          <div className={classes.styledCards}>
                            <IconButton
                              className={classes.rightIcon}
                              color='primary'
                              onClick={scrollLeft}>
                              <ArrowForwardIos />
                            </IconButton>
                            <IconButton
                              className={classes.leftIcon}
                              color='primary'
                              onClick={scrollRight}>
                              <ArrowBackIos />
                            </IconButton>
                            <TaskProgressDashboard />
                            <TasksListDashboard />
                            <TodayTasksListDashboard />
                            <MeetingsListDashboard />
                            <TodoListDashboard />
                          </div>
                        </div>
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item md={9} lg={9} xs={9} sm={9}>
                    <div>
                      <div className={classes.paddingTop_2}>
                        <Templates dashboard={true} />
                        <PersonalBoards
                          dashboard={true}
                          updated={updated}
                          updateModule={updatePersonalBoards}
                        />
                        {user?._id &&
                          (user?.employId?._id || user?.companyId?._id) && (
                            <InvitedBoards
                              dashboard={true}
                              updated={updated}
                              updateModule={updateInvitedBoards}
                            />
                          )}
                        <Favourites
                          dashboard={true}
                          updateBoards={updateBoards}
                          handleUpdated={handleUpdated}
                          updateInvited={updateInvited}
                        />
                        <CreateNewBoard
                          open={openCreate}
                          handleUpdated={handleUpdated}
                          toggleModal={toggleCreateBoard}
                        />
                      </div>
                    </div>
                  </Grid>
                  {/* <Grid item md={3} lg={3} xs={3} sm={3}>
                    {user && (user?.employId || user?.companyId) && (
                      <>
                        <br />
                        <br />
                        <br />
                        <Paper className={classes.croot} position='fixed'>
                          <List>
                            <div className={classes.alignChatHead}>
                              <Typography
                                align='center'
                                variant='h5'
                                component='h2'>
                                &nbsp;&nbsp;&nbsp;Chats
                              </Typography>
                              {chatBoxOpen ? (
                                <>
                                  <IconButton
                                    className={classes.floatRight}
                                    color='primary'
                                    onClick={handleChatBoxOpen}>
                                    <Remove />
                                  </IconButton>
                                </>
                              ) : (
                                <>
                                  <IconButton
                                    className={classes.floatRight}
                                    color='primary'
                                    onClick={handleChatBoxOpen}>
                                    <Add />
                                  </IconButton>
                                </>
                              )}
                            </div>
                             {chatBoxOpen && <DashboardChat />}
                          </List>
                        </Paper>
                      </>
                    )}
                  </Grid> */}
                </Grid>
              </div>
            </div>
          </animated.div>
        </>
      }
    />
  );
}
