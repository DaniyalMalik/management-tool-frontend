import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Typography,
  Button,
  Tooltip,
  TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { updateFavourite } from '../../actions/actionCreators/boardActions';
import { Star, VisibilityOutlined, Fullscreen } from '@material-ui/icons';
import {
  getManyFromFavourite,
  removeFromFavourite,
} from '../../actions/actionCreators/favouriteActions';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';
import AppBarDrawer from '../headers/AppBarDrawer';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';
import {
  fetchBoardById,
  fetchListsFromBoard,
  fetchCardsFromBoard,
  fetchActivitiesFromBoard,
} from '../../actions/actionCreators/boardActions';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  ci: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
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
  styledSearchBox: {
    zIndex: '1201',
    position: 'fixed',
    top: '15px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
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

export default function Favourites({
  dashboard,
  updateBoards,
  updateInvited,
  handleUpdated,
}) {
  const [refresh, setRefresh] = useState(false);
  const classes = useStyles();
  const { token, isValid, user } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [displayBoards, setDisplayBoards] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favourites } = useSelector((state) => state.favourites);
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
    if (favourites.length > 0) {
      let temp = [];

      favourites.map((board, key) =>
        temp.push({ index: key, ...board.boardId }),
      );

      setDisplayBoards(temp);
      setRefresh(false);
    }
  }, [favourites, refresh]);

  const removeBoard = async (favouriteId, boardId, boardUser, e) => {
    let tempUsers = boardUser;

    tempUsers.map((u) => u.userId === user._id && (u.favourite = false));

    const res = await dispatch(
      updateFavourite(boardId, { user: tempUsers }, token),
    );

    if (res?.success) {
      const res = await dispatch(removeFromFavourite(favouriteId, token));

      if (handleUpdated !== undefined) {
        handleUpdated();
      }

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
      setRefresh(true);
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
    if (user?._id && token) {
      dispatch(getManyFromFavourite(user._id, token));

      setRefresh(false);
    }
  }, [token, user, refresh, updateInvited, updateBoards]);

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
          <h3>Favourite Boards</h3>
          <animated.div style={props}>
            <div className={classes.menuContainer}>
              {favourites.length > 0 ? (
                favourites.map((favourite, key) =>
                  dashboard && key <= 4 ? (
                    <>
                      <div
                        className={classes.card}
                        id={key}
                        key={key}
                        // key={favourite?.boardId?._id}
                        style={{
                          backgroundColor: `${favourite?.boardId?.image?.color}`,
                          backgroundImage: `url(${favourite?.boardId?.image?.full})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }}>
                        <div className={classes.title}>
                          {favourite?.boardId?.name}
                        </div>
                        <LightTooltip title='Favourite board'>
                          <IconButton
                            onClick={(e) => {
                              dispatch(openLoader({ open: true }));
                              removeBoard(
                                favourite._id,
                                favourite.boardId._id,
                                favourite.boardId.user,
                                e,
                              );
                            }}
                            style={{
                              position: 'absolute',
                              color: '#ffffff',
                              zIndex: '1',
                              top: '60%',
                            }}>
                            <Star fontSize='small' />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title='Open board'>
                          <IconButton
                            onClick={() => {
                              dispatch(openLoader({ open: true }));
                              openBoard(
                                favourite?.boardId?._id,
                                favourite?.boardId?.name,
                              );
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
                      </div>
                    </>
                  ) : !dashboard ? (
                    <>
                      <div
                        className={classes.card}
                        id={key}
                        key={key}
                        // key={favourite?.boardId?._id}
                        style={{
                          backgroundColor: `${favourite?.boardId?.image?.color}`,
                          backgroundImage: `url(${favourite?.boardId?.image?.full})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }}>
                        <div className={classes.title}>
                          {favourite?.boardId?.name}
                        </div>
                        <LightTooltip title='Favourite board'>
                          <IconButton
                            onClick={(e) => {
                              dispatch(openLoader({ open: true }));
                              removeBoard(
                                favourite._id,
                                favourite.boardId._id,
                                favourite.boardId.user,
                                e,
                              );
                            }}
                            style={{
                              position: 'absolute',
                              color: '#ffffff',
                              zIndex: '1',
                              top: '60%',
                            }}>
                            <Star fontSize='small' />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title='Open board'>
                          <IconButton
                            onClick={() => {
                              dispatch(openLoader({ open: true }));
                              openBoard(
                                favourite?.boardId?._id,
                                favourite?.boardId?.name,
                              );
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
                      </div>
                    </>
                  ) : (
                    key === 5 &&
                    dashboard && (
                      <div
                        key={key}
                        style={{ display: 'flex', alignItems: 'center' }}>
                        <LightTooltip title='View all boards'>
                          <Button
                            color='primary'
                            size='small'
                            onClick={() =>
                              history.push(
                                `/${
                                  user?.firstName + ' ' + user?.lastName
                                }/favourites`,
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
                )
              ) : (
                <Typography variant='h5'>No Favourite Boards!</Typography>
              )}
            </div>
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
                <LightTooltip title='Search Favourite Boards'>
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
                            }/favourites#${option.index}`,
                          );
                        }}
                        style={{ width: '100%' }}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </div>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label='Search Favourite Boards'
                        className={classes.searchBox}
                        placeholder='Search Favourite Boards'
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
              <h3>Favourite Boards</h3>
              <animated.div style={props}>
                <div className={classes.menuContainer}>
                  {favourites.length > 0 ? (
                    favourites.map((favourite, key) =>
                      dashboard && key <= 4 ? (
                        <>
                          <div
                            className={classes.card}
                            id={key}
                            key={key}
                            // key={favourite?.boardId?._id}
                            style={{
                              backgroundColor: `${favourite?.boardId?.image?.color}`,
                              backgroundImage: `url(${favourite?.boardId?.image?.full})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                            }}>
                            <div className={classes.title}>
                              {favourite?.boardId?.name}
                            </div>
                            <LightTooltip title='Favourite board'>
                              <IconButton
                                onClick={(e) => {
                                  dispatch(openLoader({ open: true }));
                                  removeBoard(
                                    favourite._id,
                                    favourite.boardId._id,
                                    favourite.boardId.user,
                                    e,
                                  );
                                }}
                                style={{
                                  position: 'absolute',
                                  color: '#ffffff',
                                  zIndex: '1',
                                  top: '60%',
                                }}>
                                <Star fontSize='small' />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip title='Open board'>
                              <IconButton
                                onClick={() => {
                                  dispatch(openLoader({ open: true }));
                                  openBoard(
                                    favourite?.boardId?._id,
                                    favourite?.boardId?.name,
                                  );
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
                          </div>
                        </>
                      ) : !dashboard ? (
                        <>
                          <div
                            className={classes.card}
                            id={key}
                            key={key}
                            // key={favourite?.boardId?._id}
                            style={{
                              backgroundColor: `${favourite?.boardId?.image?.color}`,
                              backgroundImage: `url(${favourite?.boardId?.image?.full})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                            }}>
                            <div className={classes.title}>
                              {favourite?.boardId?.name}
                            </div>
                            <LightTooltip title='Favourite board'>
                              <IconButton
                                onClick={(e) => {
                                  dispatch(openLoader({ open: true }));
                                  removeBoard(
                                    favourite._id,
                                    favourite.boardId._id,
                                    favourite.boardId.user,
                                    e,
                                  );
                                }}
                                style={{
                                  position: 'absolute',
                                  color: '#ffffff',
                                  zIndex: '1',
                                  top: '60%',
                                }}>
                                <Star fontSize='small' />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip title='Open board'>
                              <IconButton
                                onClick={() => {
                                  dispatch(openLoader({ open: true }));
                                  openBoard(
                                    favourite?.boardId?._id,
                                    favourite?.boardId?.name,
                                  );
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
                          </div>
                        </>
                      ) : (
                        key === 5 &&
                        dashboard && (
                          <div
                            key={key}
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <LightTooltip title='View all boards'>
                              <Button
                                color='primary'
                                size='small'
                                onClick={() =>
                                  history.push(
                                    `/${
                                      user?.firstName + ' ' + user?.lastName
                                    }/favourites`,
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
                    )
                  ) : (
                    <Typography variant='h5'>No Favourite Boards!</Typography>
                  )}
                </div>
              </animated.div>
            </div>
          }
        />
      )}
    </>
  );
}
