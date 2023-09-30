import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  TextField,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { addToFavourite } from '../../actions/actionCreators/favouriteActions';
import {
  fetchAllBoards,
  updateFavourite,
  fetchBoardById,
  fetchListsFromBoard,
  fetchCardsFromBoard,
  fetchActivitiesFromBoard,
  deleteBoardById,
} from '../../actions/actionCreators/boardActions';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import {
  StarBorderOutlined,
  CancelOutlined,
  Star,
  AddCircleOutlineOutlined,
  Fullscreen,
  DeleteOutlined,
  VisibilityOutlined,
} from '@material-ui/icons';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import CreateNewBoard from '../board/CreateNewBoard';
import { animated, useSpring } from 'react-spring';
import AppBarDrawer from '../headers/AppBarDrawer';
import { deleteBoardAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(1),
    '@media only screen and (min-device-width : 768px) and (max-device-width : 1024px)':
      {
        marginLeft: theme.spacing(1),
      },
    '@media (max-width: 768px)': {
      marginLeft: theme.spacing(1),
    },
    marginBottom: '20px',
  },
  card: {
    curor: 'pointer',
    boxShadow: '1px 1px 3px #000000',
    [theme.breakpoints.down('sm')]: {
      height: '100px',
      width: '150px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
      paddingRight: '5px',
    },
    [theme.breakpoints.up('md')]: {
      height: '100px',
      width: '200px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
      paddingRight: '5px',
    },
    [theme.breakpoints.up('lg')]: {
      height: '100px',
      width: '200px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
      paddingRight: '5px',
    },
    [theme.breakpoints.up('xl')]: {
      width: '200px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
      paddingRight: '5px',
    },
  },
  createBoard: {
    curor: 'pointer',
    boxShadow: '1px 1px 3px #000000',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
    },
    [theme.breakpoints.up('xl')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
    },
  },
  title: {
    position: 'absolute',
    top: theme.spacing(0),
    left: theme.spacing(0),
    width: '90%',
    wordWrap: 'break-word',
    overflow: 'hidden',
    lineHeight: '1.5em',
    height: '3em',
    color: 'white',
    fontWeight: 'bold',
    textShadow: '2px 2px gray',
    paddingLeft: theme.spacing(1),
  },
  styledSearchBox: {
    zIndex: '1201',
    position: 'fixed',
    top: '15px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
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

export default function PersonalBoards({ dashboard, updateModule, updated }) {
  const [refresh, setRefresh] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const classes = useStyles();
  const { boards } = useSelector((state) => state.boards);
  const { token, isValid, user } = useSelector((state) => state.user);
  const history = useHistory();
  const [searchOpen, setSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [displayBoards, setDisplayBoards] = useState([]);
  const [board, setBoard] = useState('');
  const [isAdminPersonal, setIsAdminPersonal] = useState([]);
  const [personalBoards, setPersonalBoards] = useState([]);
  const props = useSpring({
    opacity: 1,
    transitionDuration: '0.3s',
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
  });

  const options = displayBoards.map((option) => {
    const firstLetter = option.name[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  useEffect(() => {
    if (personalBoards.length > 0) {
      let temp = [];

      personalBoards.map((board, key) => temp.push({ index: key, ...board }));

      setDisplayBoards(temp);
      setRefresh(false);
    }
  }, [personalBoards, refresh]);

  useEffect(() => {
    if (personalBoards?.length > 0) {
      let favourites = [];
      let favourite = false;

      for (let i = 0; i < personalBoards?.length; i++) {
        favourite = false;
        for (let j = 0; j < personalBoards[i]?.user?.length; j++) {
          if (
            personalBoards[i].user[j].userId._id === user._id &&
            personalBoards[i].user[j].favourite === true
          ) {
            favourite = true;
          }
        }
        favourites.push(favourite);
      }

      setFavourites(favourites);
    }
  }, [personalBoards]);

  useEffect(() => {
    if (token) dispatch(fetchUserInfo(token));
  }, [token]);

  const handleDialogOpen = (data) => {
    setBoard(data);
    setOpenDialog(true);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const toggleCreateBoard = () => {
    setOpenCreate(!openCreate);
  };

  const handleDialogClose = () => {
    setBoard('');
    setOpenDialog(false);
  };

  const addBoard = async (id, boardUser, e) => {
    let tempUsers = boardUser;

    tempUsers.map((u) => u.userId._id === user._id && (u.favourite = true));

    const res = await dispatch(updateFavourite(id, { user: tempUsers }, token));

    if (res?.success) {
      const res = await dispatch(
        addToFavourite({ userId: user._id, boardId: id }, token),
      );

      if (res?.success) {
        setRefresh(true);
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());

        if (updateModule !== undefined) {
          updateModule();
        }
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

  useEffect(() => {
    if (personalBoards?.length > 0) {
      let admin = [];
      let isAdmin = false;

      for (let i = 0; i < personalBoards.length; i++) {
        for (let j = 0; j < personalBoards[i].user.length; j++) {
          if (
            personalBoards[i].user[j].userId._id === user._id &&
            personalBoards[i].user[j].role == 'Admin'
          ) {
            isAdmin = true;
          }
        }

        admin.push(isAdmin);

        isAdmin = false;
      }

      setIsAdminPersonal(admin);
    }
  }, [personalBoards]);

  const onDeleteBoard = async (e) => {
    const res = await dispatch(deleteBoardById(board?._id, token));
    deleteBoardAttachment(board?._id, token);

    if (res?.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());

      if (updateModule !== undefined) {
        updateModule();
      }
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

    handleDialogClose();
  };

  useEffect(() => {
    let array = [];
    if (boards?.length > 0) {
      boards.map((board) => {
        board?.user &&
          board.user.map(
            (u) =>
              u.userId._id === user._id &&
              u.role === 'Admin' &&
              array.push(board),
          );
      });

      setPersonalBoards(array);
    }
  }, [boards]);

  useEffect(() => {
    if (isValid && token) {
      dispatch(fetchAllBoards(token));
    }

    setRefresh(false);
  }, [token, isValid, dispatch, refresh, updated]);

  const openBoard = async (id, name) => {
    if (token && isValid && id) {
      let res = await dispatch(fetchBoardById(id, token));

      if (!res?.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Cannot open board!',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }

      if (res?.success) {
        dispatch(fetchActivitiesFromBoard(id, token));
      }

      if (res?.success) {
        res = await dispatch(fetchListsFromBoard(id, token));
      } else if (!res?.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Cannot open board!',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }

      if (res?.success) {
        res = await dispatch(fetchCardsFromBoard(id, token));
      } else if (!res?.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Cannot open board!',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }

      if (res?.success) dispatch(closeLoader());

      res.success && history.push(`/board/${id}/${name}`);
    } else {
      return;
    }
  };

  return (
    <>
      {dashboard ? (
        <div style={{ padding: '20px' }}>
          <h3>Your Boards</h3>
          <animated.div style={props}>
            <div className={classes.menuContainer}>
              {personalBoards.length > 0 &&
                personalBoards.map((board, key) =>
                  dashboard && key <= 4 ? (
                    <>
                      <div
                        className={classes.card}
                        id={key}
                        key={board._id}
                        style={{
                          backgroundColor: `${board.image.color}`,
                          backgroundImage: `url(${board?.image?.full})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }}>
                        <div className={classes.title}>{board.name}</div>
                        {isAdminPersonal[key] ? (
                          <>
                            <LightTooltip title='Delete board'>
                              <IconButton
                                onClick={() => handleDialogOpen(board)}
                                style={{
                                  position: 'absolute',
                                  color: '#ffffff',
                                  zIndex: '1',
                                  top: '60%',
                                }}>
                                <DeleteOutlined fontSize='small' />
                              </IconButton>
                            </LightTooltip>
                            {!favourites[key] ? (
                              <>
                                <LightTooltip title='Mark favourite'>
                                  <IconButton
                                    onClick={(e) => {
                                      dispatch(openLoader({ open: true }));
                                      addBoard(board._id, board.user, e);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <StarBorderOutlined fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '30%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            ) : (
                              <>
                                <LightTooltip title='Favourite board'>
                                  <Star
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      cursor: 'context-menu',
                                      zIndex: '1',
                                      left: '85%',
                                      top: '5%',
                                    }}
                                    fontSize='small'
                                  />
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {!favourites[key] ? (
                              <>
                                <LightTooltip title='Mark favourite'>
                                  <IconButton
                                    onClick={(e) => {
                                      dispatch(openLoader({ open: true }));
                                      addBoard(board._id, board.user, e);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                    }}>
                                    <StarBorderOutlined fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            ) : (
                              <>
                                <LightTooltip title='Favourite board'>
                                  <Star
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      cursor: 'context-menu',
                                      zIndex: '1',
                                      left: '85%',
                                      top: '5%',
                                    }}
                                    fontSize='small'
                                  />
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : !dashboard ? (
                    <>
                      <div
                        className={classes.card}
                        id={key}
                        key={board._id}
                        style={{
                          backgroundColor: `${board.image.color}`,
                          backgroundImage: `url(${board?.image?.full})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }}>
                        <div className={classes.title}>{board.name}</div>
                        {isAdminPersonal[key] ? (
                          <>
                            <IconButton
                              onClick={() => handleDialogOpen(board)}
                              style={{
                                position: 'absolute',
                                color: '#ffffff',
                                zIndex: '1',
                                top: '60%',
                              }}>
                              <DeleteOutlined fontSize='small' />
                            </IconButton>
                            {!favourites[key] ? (
                              <>
                                <LightTooltip title='Mark favourite'>
                                  <IconButton
                                    onClick={(e) => {
                                      dispatch(openLoader({ open: true }));
                                      addBoard(board._id, board.user, e);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <StarBorderOutlined fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '30%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            ) : (
                              <>
                                <LightTooltip title='Favourite board'>
                                  <Star
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      cursor: 'context-menu',
                                      zIndex: '1',
                                      left: '85%',
                                      top: '5%',
                                    }}
                                    fontSize='small'
                                  />
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {!favourites[key] ? (
                              <>
                                <LightTooltip title='Mark favourite'>
                                  <IconButton
                                    onClick={(e) => {
                                      dispatch(openLoader({ open: true }));
                                      addBoard(board._id, board.user, e);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                    }}>
                                    <StarBorderOutlined fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            ) : (
                              <>
                                <LightTooltip title='Favourite board'>
                                  <Star
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      cursor: 'context-menu',
                                      zIndex: '1',
                                      left: '85%',
                                      top: '5%',
                                    }}
                                    fontSize='small'
                                  />
                                </LightTooltip>
                                <LightTooltip title='Open board'>
                                  <IconButton
                                    onClick={() => {
                                      dispatch(openLoader({ open: true }));
                                      openBoard(board?._id, board?.name);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      color: '#ffffff',
                                      zIndex: '1',
                                      top: '60%',
                                      left: '15%',
                                    }}>
                                    <Fullscreen fontSize='small' />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    key === 5 &&
                    dashboard && (
                      <div
                        id={key}
                        style={{ display: 'flex', alignItems: 'center' }}>
                        <LightTooltip title='View all boards'>
                          <Button
                            color='primary'
                            size='small'
                            onClick={() =>
                              history.push(
                                `/${
                                  user?.firstName + ' ' + user?.lastName
                                }/boards`,
                              )
                            }
                            style={{ height: 'fit-content' }}
                            startIcon={<VisibilityOutlined fontSize='large' />}>
                            View All
                          </Button>
                        </LightTooltip>
                      </div>
                    )
                  ),
                )}
              <LightTooltip title='Create board'>
                <div
                  className={classes.createBoard}
                  onClick={toggleCreateBoard}>
                  <div>
                    <div
                      style={{
                        backgroundColor: '#E7E9ED',
                        width: '140px',
                        paddingTop: '25px',
                        height: '100px',
                        borderRadius: theme.spacing(0.7),
                        cursor: 'pointer',
                      }}>
                      <AddCircleOutlineOutlined
                        style={{
                          display: 'flex',
                          marginLeft: '60px',
                          color: '#183569',
                        }}
                      />
                      <div
                        style={{
                          paddingTop: '10px',
                          textAlign: 'center',
                        }}>
                        Create a Blank Board
                      </div>
                    </div>
                  </div>
                </div>
              </LightTooltip>
            </div>
            <Dialog
              fullWidth
              open={openDialog}
              onClose={handleDialogClose}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'>
              <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Delete board permanently?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant='contained'
                  onClick={handleDialogClose}
                  startIcon={<CancelOutlined />}
                  size='small'>
                  No
                </Button>
                <Button
                  startIcon={<DeleteOutlined />}
                  onClick={() => {
                    dispatch(openLoader({ open: true }));
                    onDeleteBoard();
                  }}
                  variant='contained'
                  color='primary'
                  size='small'>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <CreateNewBoard
              update={refresh}
              open={openCreate}
              toggleModal={toggleCreateBoard}
              handleRefresh={handleRefresh}
            />
          </animated.div>
        </div>
      ) : (
        <AppBarDrawer
          component={
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <LightTooltip title='Search Personal Boards'>
                  <Autocomplete
                    id='grouped-demo'
                    options={options.sort(
                      (a, b) => -b.firstLetter.localeCompare(a.firstLetter),
                    )}
                    size='small'
                    open={searchOpen}
                    popupIcon={null}
                    getOptionLabel={(option) => option.name}
                    className={classes.styledSearchBox}
                    clearOnEscape
                    renderOption={(option) => (
                      <div
                        onClick={(e) => {
                          e.preventDefault();

                          window.location.replace(
                            `/${
                              user?.firstName + ' ' + user?.lastName
                            }/boards#${option.index}`,
                          );
                        }}
                        style={{ width: '100%' }}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </div>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label='Search Personal Boards'
                        className={classes.searchBox}
                        placeholder='Search Personal Boards'
                        size='small'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        {...params}
                        onBlur={() => setSearchOpen(false)}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSearchOpen(true);
                          } else {
                            setSearchOpen(false);
                          }
                        }}
                        variant='outlined'
                      />
                    )}
                  />
                </LightTooltip>
              </div>
              <h3>Your Boards</h3>
              <animated.div style={props}>
                <div className={classes.menuContainer}>
                  {personalBoards.length > 0 &&
                    personalBoards.map((board, key) =>
                      dashboard && key <= 4 ? (
                        <>
                          <div
                            className={classes.card}
                            id={key}
                            key={board._id}
                            style={{
                              backgroundColor: `${board.image.color}`,
                              backgroundImage: `url(${board?.image?.full})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                            }}>
                            <div className={classes.title}>{board.name}</div>
                            {isAdminPersonal[key] ? (
                              <>
                                <IconButton
                                  onClick={() => handleDialogOpen(board)}
                                  style={{
                                    position: 'absolute',
                                    color: '#ffffff',
                                    zIndex: '1',
                                    top: '60%',
                                  }}>
                                  <DeleteOutlined fontSize='small' />
                                </IconButton>
                                {!favourites[key] ? (
                                  <>
                                    <LightTooltip title='Mark favourite'>
                                      <IconButton
                                        onClick={(e) => {
                                          dispatch(openLoader({ open: true }));
                                          addBoard(board._id, board.user, e);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <StarBorderOutlined fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '30%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                ) : (
                                  <>
                                    <LightTooltip title='Favourite board'>
                                      <Star
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          cursor: 'context-menu',
                                          zIndex: '1',
                                          left: '85%',
                                          top: '5%',
                                        }}
                                        fontSize='small'
                                      />
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {!favourites[key] ? (
                                  <>
                                    <LightTooltip title='Mark favourite'>
                                      <IconButton
                                        onClick={(e) => {
                                          dispatch(openLoader({ open: true }));
                                          addBoard(board._id, board.user, e);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                        }}>
                                        <StarBorderOutlined fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                ) : (
                                  <>
                                    <LightTooltip title='Favourite board'>
                                      <Star
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          cursor: 'context-menu',
                                          zIndex: '1',
                                          left: '85%',
                                          top: '5%',
                                        }}
                                        fontSize='small'
                                      />
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      ) : !dashboard ? (
                        <>
                          <div
                            className={classes.card}
                            id={key}
                            key={board._id}
                            style={{
                              backgroundColor: `${board.image.color}`,
                              backgroundImage: `url(${board?.image?.full})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                            }}>
                            <div className={classes.title}>{board.name}</div>
                            {isAdminPersonal[key] ? (
                              <>
                                <IconButton
                                  onClick={() => handleDialogOpen(board)}
                                  style={{
                                    position: 'absolute',
                                    color: '#ffffff',
                                    zIndex: '1',
                                    top: '60%',
                                  }}>
                                  <DeleteOutlined fontSize='small' />
                                </IconButton>
                                {!favourites[key] ? (
                                  <>
                                    <LightTooltip title='Mark favourite'>
                                      <IconButton
                                        onClick={(e) => {
                                          dispatch(openLoader({ open: true }));
                                          addBoard(board._id, board.user, e);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <StarBorderOutlined fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '30%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                ) : (
                                  <>
                                    <LightTooltip title='Favourite board'>
                                      <Star
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          cursor: 'context-menu',
                                          zIndex: '1',
                                          left: '85%',
                                          top: '5%',
                                        }}
                                        fontSize='small'
                                      />
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {!favourites[key] ? (
                                  <>
                                    <LightTooltip title='Mark favourite'>
                                      <IconButton
                                        onClick={(e) => {
                                          dispatch(openLoader({ open: true }));
                                          addBoard(board._id, board.user, e);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                        }}>
                                        <StarBorderOutlined fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                ) : (
                                  <>
                                    <LightTooltip title='Favourite board'>
                                      <Star
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          cursor: 'context-menu',
                                          zIndex: '1',
                                          left: '85%',
                                          top: '5%',
                                        }}
                                        fontSize='small'
                                      />
                                    </LightTooltip>
                                    <LightTooltip title='Open board'>
                                      <IconButton
                                        onClick={() => {
                                          dispatch(openLoader({ open: true }));
                                          openBoard(board?._id, board?.name);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          color: '#ffffff',
                                          zIndex: '1',
                                          top: '60%',
                                          left: '15%',
                                        }}>
                                        <Fullscreen fontSize='small' />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        key === 5 &&
                        dashboard && (
                          <div
                            id={key}
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <LightTooltip title='View all boards'>
                              <Button
                                color='primary'
                                size='small'
                                onClick={() =>
                                  history.push(
                                    `/${
                                      user?.firstName + ' ' + user?.lastName
                                    }/boards`,
                                  )
                                }
                                style={{ height: 'fit-content' }}
                                startIcon={
                                  <VisibilityOutlined fontSize='large' />
                                }>
                                View All
                              </Button>
                            </LightTooltip>
                          </div>
                        )
                      ),
                    )}
                  <div
                    className={classes.createBoard}
                    onClick={toggleCreateBoard}>
                    <div>
                      <div
                        style={{
                          backgroundColor: '#E7E9ED',
                          width: '140px',
                          paddingTop: '25px',
                          height: '100px',
                          borderRadius: theme.spacing(0.7),
                          cursor: 'pointer',
                        }}>
                        <AddCircleOutlineOutlined
                          style={{
                            display: 'flex',
                            marginLeft: '60px',
                          }}
                          fontSize='medium'
                        />
                        <div
                          style={{
                            paddingTop: '10px',
                            textAlign: 'center',
                          }}>
                          Create a Blank Board
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Dialog
                  fullWidth
                  open={openDialog}
                  onClose={handleDialogClose}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'>
                  <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                      Delete board permanently?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant='contained'
                      onClick={handleDialogClose}
                      startIcon={<CancelOutlined />}
                      size='small'>
                      No
                    </Button>
                    <Button
                      startIcon={<DeleteOutlined />}
                      onClick={() => {
                        dispatch(openLoader({ open: true }));
                        onDeleteBoard();
                      }}
                      variant='contained'
                      color='primary'
                      size='small'>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
                <CreateNewBoard
                  update={refresh}
                  open={openCreate}
                  handleRefresh={handleRefresh}
                  toggleModal={toggleCreateBoard}
                />
              </animated.div>
            </div>
          }
        />
      )}
    </>
  );
}
