import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  createNewBoard,
  fetchBoardById,
  fetchListsFromBoard,
  fetchCardsFromBoard,
  fetchActivitiesFromBoard,
} from '../../actions/actionCreators/boardActions';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createNewList } from '../../actions/actionCreators/listActions';
import { createNewActivity } from '../../actions/actionCreators/activityActions';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
} from '@material-ui/core';
import { VisibilityOutlined, CreateOutlined } from '@material-ui/icons';
import template_1 from '../../assets/budget_management_bg.png';
import template_2 from '../../assets/retail_salespipeline_bg.png';
import template_3 from '../../assets/clientworkflow_management_bg.png';
import template_4 from '../../assets/syllabus_template_bg.png';
import template_5 from '../../assets/lesson_planning_bg.png';
import template_6 from '../../assets/delivery_tracking_bg.png';
import { animated, useSpring } from 'react-spring';
import AppBarDrawer from '../headers/AppBarDrawer';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  cardBox: {
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
  inline: {
    display: 'inline',
  },
  display: {
    display: 'flex',
    justifyContent: 'center',
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
      height: '100px',
      width: '200px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.7),
      position: 'relative',
      paddingRight: '5px',
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

export default function Templates({ dashboard }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [displayBoards, setDisplayBoards] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const { token, isValid, user } = useSelector((state) => state.user);
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
    let temp = [];

    templates.map((board, key) => temp.push({ index: key, ...board }));

    setDisplayBoards(temp);
  }, []);

  const createTemplateBoard = async (index, e) => {
    e.preventDefault();

    const postBoardReq = {
      name: templates[index].name,
      type: 'Template',
      subType: templates[index].name,
      user: [{ userId: user?._id, role: 'Admin' }],
      companyId: user?.companyId ? user.companyId : user?.employId,
      image: {
        color: 'white',
        thumb: templates[index].full,
        full: templates[index].full,
      },
    };
    const res = await dispatch(createNewBoard(postBoardReq, token));

    templates[index].lists.map(async (list) => {
      const postListReq = {
        name: list.name,
        user: res?.board?.user,
        boardId: res?.board?._id,
        companyId: user?.companyId ? user.companyId : user?.employId,
        order: list.order,
      };

      postListReq.user[0].role = 'Editor';

      dispatch(createNewList(postListReq, token));
      await dispatch(
        createNewActivity(
          {
            text: `${user?.firstName + ' ' + user?.lastName} added ${
              list.name
            } to this board`,
            boardId: res?._id,
          },
          token,
        ),
      );
    });

    openBoard(res?.board?._id, res?.board?.name);
  };

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
            message: 'Template not created!',
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
            message: 'Template not created!',
            severity: false,
          }),
        );
        return dispatch(closeLoader());
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Template created!',
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());

      res.success && history.push(`/board/${id}/${name}`);
    } else {
      return;
    }
  };

  return (
    <>
      {dashboard ? (
        <div style={{ padding: '20px' }}>
          <h3>Templates for Board</h3>
          <animated.div style={props}>
            <div className={classes.cardBox}>
              {templates.length > 0 ? (
                templates.map((template, key) =>
                  dashboard && key <= 4 ? (
                    <div
                      className={classes.card}
                      key={key}
                      id={key}
                      style={{
                        backgroundColor: `${template.color}`,
                        backgroundImage: `url(${template?.full})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      }}>
                      <div className={classes.title}>{template.name}</div>
                      <LightTooltip title='Create template'>
                        <IconButton
                          onClick={(e) => {
                            dispatch(openLoader({ open: true }));
                            createTemplateBoard(key, e);
                          }}
                          style={{
                            position: 'absolute',
                            color: '#ffffff',
                            zIndex: '1',
                            top: '60%',
                          }}>
                          <CreateOutlined fontSize='small' />
                        </IconButton>
                      </LightTooltip>
                    </div>
                  ) : !dashboard ? (
                    <div
                      className={classes.card}
                      id={key}
                      key={key}
                      style={{
                        backgroundColor: `${template.color}`,
                        backgroundImage: `url(${template?.full})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      }}>
                      <div className={classes.title}>{template.name}</div>
                      <LightTooltip title='Create template'>
                        <IconButton
                          onClick={(e) => {
                            dispatch(openLoader({ open: true }));
                            createTemplateBoard(key, e);
                          }}
                          style={{
                            position: 'absolute',
                            color: '#ffffff',
                            zIndex: '1',
                            top: '60%',
                          }}>
                          <CreateOutlined fontSize='small' />
                        </IconButton>
                      </LightTooltip>
                    </div>
                  ) : (
                    key === 5 &&
                    dashboard && (
                      <div
                        id={key}
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
                                }/templates`,
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
                <Typography variant='h5'>No templates found!</Typography>
              )}
            </div>
          </animated.div>
          <br />
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
                <LightTooltip title='Search Templates'>
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
                            }/templates#${option.index}`,
                          );
                        }}
                        style={{ width: '100%' }}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </div>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label='Search Templates'
                        className={classes.searchBox}
                        placeholder='Search Templates'
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
              <h3>Templates for Board</h3>
              <animated.div style={props}>
                <div className={classes.cardBox}>
                  {templates.length > 0 ? (
                    templates.map((template, key) =>
                      dashboard && key <= 4 ? (
                        <div
                          className={classes.card}
                          key={key}
                          id={key}
                          style={{
                            backgroundColor: `${template.color}`,
                            backgroundImage: `url(${template?.full})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}>
                          <div className={classes.title}>{template.name}</div>
                          <LightTooltip title='Create template'>
                            <IconButton
                              onClick={(e) => {
                                dispatch(openLoader({ open: true }));
                                createTemplateBoard(key, e);
                              }}
                              style={{
                                position: 'absolute',
                                color: '#ffffff',
                                zIndex: '1',
                                top: '60%',
                              }}>
                              <CreateOutlined fontSize='small' />
                            </IconButton>
                          </LightTooltip>
                        </div>
                      ) : !dashboard ? (
                        <div
                          className={classes.card}
                          id={key}
                          key={key}
                          style={{
                            backgroundColor: `${template.color}`,
                            backgroundImage: `url(${template?.full})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}>
                          <div className={classes.title}>{template.name}</div>
                          <LightTooltip title='Create template'>
                            <IconButton
                              onClick={(e) => {
                                dispatch(openLoader({ open: true }));
                                createTemplateBoard(key, e);
                              }}
                              style={{
                                position: 'absolute',
                                color: '#ffffff',
                                zIndex: '1',
                                top: '60%',
                              }}>
                              <CreateOutlined fontSize='small' />
                            </IconButton>
                          </LightTooltip>
                        </div>
                      ) : (
                        key === 5 &&
                        dashboard && (
                          <div
                            id={key}
                            key={key}
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                              color='primary'
                              size='small'
                              onClick={() =>
                                history.push(
                                  `/${
                                    user?.firstName + ' ' + user?.lastName
                                  }/templates`,
                                )
                              }
                              style={{ height: 'fit-content' }}
                              startIcon={
                                <VisibilityOutlined fontSize='large' />
                              }>
                              View All
                            </Button>
                          </div>
                        )
                      ),
                    )
                  ) : (
                    <Typography variant='h5'>No templates found!</Typography>
                  )}
                </div>
              </animated.div>
              <br />
            </div>
          }
        />
      )}
    </>
  );
}

const templates = [
  {
    name: 'Budget Management',
    full: template_1,
    lists: [
      { name: 'BRAINSTORMING', order: 'n' },
      { name: 'FOR APPROVAL', order: 'u' },
      { name: 'PO AWARDED', order: 'x' },
      { name: 'IN EXECUTION', order: 'z' },
      { name: 'EXECUTION ENDED', order: 'zn' },
    ],
  },
  {
    name: 'Retail Sales Pipeline',
    full: template_2,
    lists: [
      { name: 'New Inquiry', order: 'n' },
      { name: 'On Transfer', order: 'u' },
      { name: 'Pending', order: 'x' },
      { name: 'On Special Order', order: 'z' },
      { name: 'Needs Follow-Up', order: 'zn' },
      { name: 'Road Away On A Shiny New Bike', order: 'zu' },
      { name: 'Chose To Ride A Scooter Instead', order: 'zx' },
    ],
  },
  {
    name: 'Client Workflow Management',
    full: template_3,
    lists: [
      { name: 'New Client Onboarding', order: 'n' },
      { name: 'Attorney Assigned', order: 'u' },
      { name: 'Doing', order: 'x' },
      { name: 'On Hold', order: 'z' },
      { name: 'Win', order: 'zn' },
      { name: 'Lost', order: 'zu' },
    ],
  },
  {
    name: 'Syllabus Template',
    full: template_4,
    lists: [
      { name: 'Topic #1', order: 'n' },
      { name: 'Topic #2', order: 'u' },
      { name: 'Topic #3', order: 'x' },
      { name: 'Course Parking Lot', order: 'z' },
      { name: 'Research Topics', order: 'zn' },
      { name: 'Ideas for Assignments', order: 'zu' },
    ],
  },
  {
    name: 'Lesson Planning',
    full: template_5,
    lists: [
      { name: 'Q1', order: 'n' },
      { name: 'Q2', order: 'u' },
      { name: 'Q3', order: 'x' },
      { name: 'Q4', order: 'z' },
      { name: 'Resources', order: 'zn' },
    ],
  },
  {
    name: 'Delivery Tracking',
    full: template_6,
    lists: [
      { name: '1', order: 'n' },
      { name: '2', order: 'u' },
      { name: '3', order: 'x' },
      { name: '4', order: 'z' },
      { name: '5', order: 'zn' },
      { name: '6', order: 'zu' },
      { name: '7', order: 'zx' },
      { name: '8', order: 'zz' },
      { name: '9', order: 'zzn' },
      { name: '10', order: 'zzu' },
      { name: '11', order: 'zzx' },
      { name: '12', order: 'zzz' },
    ],
  },
];
