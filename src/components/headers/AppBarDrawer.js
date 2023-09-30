import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  List,
  Drawer,
  AppBar as AppBarCore,
  Toolbar,
  CssBaseline,
  ListItemText,
  ListItemIcon,
  ListItem,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemAvatar,
  Avatar,
  Fade,
  Badge,
  Button,
  DialogActions,
  DialogContentText,
  DialogContent,
  Dialog,
  Tooltip,
  DialogTitle,
} from '@material-ui/core';
import Subscribe from '../Utilities/Subscribe';
import ReactTimeAgo from 'react-time-ago';
import socketIOClient from 'socket.io-client';
import {
  getNotifications,
  deleteNotification,
  updateNotification,
} from '../../actions/actionCreators/notificationActions';
import lgif from '../../assets/lgif.gif';
import { Link } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Clear,
  ChevronLeft,
  ChevronRight,
  NotificationsNone,
  PersonalVideo,
  FavoriteBorder,
  Schedule,
  SettingsOutlined,
  InboxOutlined,
  AccountBoxOutlined,
  DashboardOutlined,
  ExitToApp,
  FormatListNumbered,
  AssignmentOutlined,
  CancelOutlined,
  DeleteOutlined,
  MailOutlineOutlined,
  DraftsOutlined,
} from '@material-ui/icons';
// import cv from '../../assets/cv.png';
import template from '../../assets/template.png';
import invite from '../../assets/invite.png';
import { logoutUser } from '../../actions/actionCreators/userActions';
import ChatApp from '../chat/ChatApp';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
  appBar: {
    backgroundColor: '#ffffff',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  name: {
    fontWeight: 'bold',
    color: 'black',
    paddingRight: '5px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'lightgrey',
    marginRight: theme.spacing(2),
    marginLeft: 30,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  sectionDesktop: {
    color: '#183569',
    cursor: 'pointer',
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  styledNotification: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styledIcons: {
    width: '20px',
    height: '20px',
  },
  coloredIcons: {
    color: '#183569',
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

export default function AppBarDrawer({ component }) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [read, setRead] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [newNotification, setNewNotification] = useState(false);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const { notifications } = useSelector((state) => state.notifications);
  const [badgeValue, setBadgeValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { token, user } = useSelector((state) => state.user);
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO);

  const countLength = () => {
    if (token && user?._id && notifications?.length > 0) {
      let arr = 0;

      notifications.map((notification) =>
        notification.for.map(
          (item) => item.userId._id === user._id && !item.viewed && arr++,
        ),
      );

      setBadgeValue(arr);
    } else {
      setBadgeValue(0);
    }
  };

  useEffect(() => {
    countLength();
  }, [user, token, notifications]);

  useEffect(() => {
    setTimeout(function () {
      setOpenSubscribe(true);
    }, 1800000);
  }, []);

  const fetchNotifications = async () => {
    if (token && user?._id) {
      // console.log('here!!!!!!!!!!');
      dispatch(
        getNotifications(
          user?.companyId?._id ? user.companyId._id : user?.employId?._id,
          user?._id,
          token,
        ),
      );

      await countLength();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, newNotification]);

  useEffect(() => {
    if (notifications.length > 0) {
      let arr = [];

      notifications.map((notification) =>
        notification.for.map(
          (item) =>
            item.userId._id === user._id &&
            (item.viewed ? arr.push(true) : arr.push(false)),
        ),
      );

      setRead(arr);
    }
  }, [notifications]);

  useEffect(() => {
    socket.on('notification', (data) => {
      let arr = [];
      // console.log(data, 'data');
      data.for.map((item) => arr.push(item.userId));
      // console.log(arr, 'arr');
      // console.log(user, 'user2');
      if (arr.includes(user?._id)) {
        setNewNotification((prev) => !prev);
      }
    });

    return () => {
      socket.removeListener('notification');
    };
  }, []);

  const removeNotification = async (id) => {
    dispatch(deleteNotification(id, token));
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const viewNotification = async (notification) => {
    let arr = notification.for;

    arr.map((item) => item.userId._id === user._id && (item.viewed = true));

    dispatch(updateNotification(notification._id, { for: arr }, token));
  };

  const renderMenu = (
    <Menu
      id='fade-menu'
      MenuListProps={{
        'aria-labelledby': 'fade-button',
      }}
      anchorEl={anchorEl}
      style={{ marginTop: '50px' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}>
      <List>
        {notifications?.length > 0 ? (
          notifications.map((notification, key) => (
            <>
              <ListItem alignItems='flex-start' key={key}>
                <ListItemAvatar>
                  <Avatar
                    alt={
                      notification?.from?.firstName +
                      ' ' +
                      notification?.from?.lastName
                    }
                    src={notification?.from?.imagePath}>
                    {!notification?.from?.imagePath &&
                      notification?.from?.firstName?.split('')[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification?.title}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component='span'
                        variant='body2'
                        color='textPrimary'>
                        <b>
                          {notification?.from?.firstName +
                            ' ' +
                            notification?.from?.lastName +
                            ' — '}
                        </b>
                      </Typography>
                      {notification?.description}
                      <br />
                      <Typography
                        color='textPrimary'
                        variant='subtitle2'
                        component='span'>
                        <ReactTimeAgo
                          date={new Date(notification?.createdAt)}
                          locale='en-US'
                        />
                      </Typography>
                    </>
                  }
                />
                {read[key] ? (
                  // <IconButton >
                  <DraftsOutlined
                    style={{ margin: '5px', marginTop: '12px' }}
                    color='primary'
                  />
                ) : (
                  // </IconButton>
                  <IconButton onClick={() => viewNotification(notification)}>
                    <MailOutlineOutlined color='primary' />
                  </IconButton>
                )}
                <IconButton
                  onClick={(e) => removeNotification(notification._id)}>
                  <Clear color='primary' />
                </IconButton>
              </ListItem>
              <Divider variant='inset' component='li' />
            </>
          ))
        ) : (
          <ListItem alignItems='flex-start'>
            <ListItemText primary='None' />
          </ListItem>
        )}
      </List>
      {/* </Box> */}
    </Menu>
  );

  const handleClick = (event) => {
    // if (notifications?.length > 0) {
    //   notifications.map(
    //     async (n) =>
    //       n?.viewed == false &&
    //       (await dispatch(updateNotification(n._id, { viewed: true }, token))),
    //   );
    // }

    setAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton
          className={classes.sectionDesktop}
          id='fade-button'
          aria-controls='fade-menu'
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}>
          <Badge color='primary' badgeContent={badgeValue} max={9}>
            <NotificationsNone />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <Link
          to={
            '/' +
            user?.firstName +
            ' ' +
            user?.lastName +
            '/profile/' +
            user?._id
          }>
          <Avatar
            alt={user?.firstName}
            style={{
              color: 'black',
            }}
            src={user?.imagePath}>
            {!user?.imagePath && user?.firstName?.split('')[0]}
          </Avatar>
        </Link>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleSubscribe = (e) => {
    setOpenSubscribe(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const onLogout = () => {
    localStorage.removeItem('bizstruc-token');

    dispatch(logoutUser());
    handleDialogClose();
    history.push('/');
  };

  return (
    <div className={classes.root}>
      {!user?.subscribed && (
        <Subscribe open={openSubscribe} handleSubscribe={handleSubscribe} />
      )}
      <ChatApp modalOpen={modalOpen} handleModal={handleModal} />
      <CssBaseline />
      <AppBarCore
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
        <Toolbar>
          <IconButton
            style={{ color: '#183569' }}
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}>
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Link to={'/' + user?.firstName + ' ' + user?.lastName + '/home'}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <img
                  style={{
                    height: '30px',
                    width: '40px',
                  }}
                  src={lgif}
                />
                <Typography
                  variant='h4'
                  style={{
                    fontWeight: 'bold',
                    fontSize: '25px',
                  }}>
                  BIZSTRUC
                </Typography>
              </div>
            </Link>
            <div
              style={{
                display: 'flex',
              }}>
              <LightTooltip title='Notification'>
                <IconButton
                  className={classes.sectionDesktop}
                  id='demo-positioned-button'
                  aria-controls='demo-positioned-menu'
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}>
                  <Badge color='primary' badgeContent={badgeValue} max={9}>
                    <NotificationsNone />
                  </Badge>
                </IconButton>
              </LightTooltip>
              <Link
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                to={
                  '/' +
                  user?.firstName +
                  ' ' +
                  user?.lastName +
                  '/profile/' +
                  user?._id
                }>
                <div className={classes.name}>
                  {user?._id && user?.firstName + ' ' + user?.lastName}
                </div>
                <Avatar
                  alt={user?.firstName}
                  style={{
                    color: 'black',
                  }}
                  src={user?.imagePath}>
                  {!user?.imagePath && user?.firstName?.split('')[0]}
                </Avatar>
              </Link>
            </div>
          </div>
        </Toolbar>
      </AppBarCore>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}>
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <List component='nav' aria-label='main mailbox folders'>
          <LightTooltip title='Home' placement='top'>
            <Link to={`/${user?.firstName + ' ' + user?.lastName}/home`}>
              <ListItem button>
                <ListItemIcon>
                  <DashboardOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Home' />
              </ListItem>
            </Link>
          </LightTooltip>
          <LightTooltip title='Personal Boards' placement='top'>
            <Link to={`/${user?.firstName + ' ' + user?.lastName}/boards`}>
              <ListItem button>
                <ListItemIcon>
                  <PersonalVideo color='primary' />
                </ListItemIcon>
                <ListItemText primary='Personal Boards' />
              </ListItem>
            </Link>
          </LightTooltip>
          {(user?.employId?._id || user?.companyId?._id) && (
            <LightTooltip title='Invited Boards' placement='top'>
              <Link
                to={`/${user?.firstName + ' ' + user?.lastName}/invitedboards`}>
                <ListItem button>
                  <ListItemIcon>
                    <img src={invite} className={classes.styledIcons} />
                  </ListItemIcon>
                  <ListItemText primary='Invited Boards' />
                </ListItem>
              </Link>
            </LightTooltip>
          )}
          <LightTooltip title='Favourite Boards' placement='top'>
            <Link to={`/${user?.firstName + ' ' + user?.lastName}/favourites`}>
              <ListItem button>
                <ListItemIcon>
                  <FavoriteBorder color='primary' />
                </ListItemIcon>
                <ListItemText primary='Favourite Boards' />
              </ListItem>
            </Link>
          </LightTooltip>
          <LightTooltip title='Templates for Board' placement='top'>
            <Link to={`/${user?.firstName + ' ' + user?.lastName}/templates`}>
              <ListItem button>
                <ListItemIcon>
                  <img src={template} className={classes.styledIcons} />
                </ListItemIcon>
                <ListItemText primary='Templates for Board' />
              </ListItem>
            </Link>
          </LightTooltip>
          <LightTooltip title='Manage Profile' placement='top'>
            <Link
              to={
                '/' +
                user?.firstName +
                ' ' +
                user?.lastName +
                '/profile/' +
                user?._id
              }>
              <ListItem button>
                <ListItemIcon>
                  <AccountBoxOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='User Profile' />
              </ListItem>
            </Link>
          </LightTooltip>
          {(user?.employId?._id || user?.companyId?._id) && (
            <LightTooltip title='Manage Meetings' placement='top'>
              <Link
                to={'/' + user?.firstName + ' ' + user?.lastName + '/meetings'}>
                <ListItem button>
                  <ListItemIcon>
                    <Schedule color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Meetings' />
                </ListItem>
              </Link>
            </LightTooltip>
          )}
          <LightTooltip title='Manage Todo List' placement='top'>
            <Link to={'/' + user?.firstName + ' ' + user?.lastName + '/todos'}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListNumbered color='primary' />
                </ListItemIcon>
                <ListItemText primary='Todo List' />
              </ListItem>
            </Link>
          </LightTooltip>
          {(user?.employId?._id || user?.companyId?._id) && (
            <LightTooltip title='Manage Tasks' placement='top'>
              <Link
                to={'/' + user?.firstName + ' ' + user?.lastName + '/tasks'}>
                <ListItem button>
                  <ListItemIcon>
                    <AssignmentOutlined color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Tasks' />
                </ListItem>
              </Link>
            </LightTooltip>
          )}
          {/* {(user?.employId?._id || user?.companyId?._id) && (
            <LightTooltip title='Inbox' placement='top'>
              <ListItem button onClick={handleModal}>
                <ListItemIcon>
                  <InboxOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Inbox' />
              </ListItem>
            </LightTooltip>
          )} */}
          {(user?.companyId?._id ||
            (!user?.companyId?._id && !user?.employId?._id)) && (
            <LightTooltip title='Settings' placement='top'>
              <Link to={`/${user?.firstName + ' ' + user?.lastName}/settings`}>
                <ListItem button>
                  <ListItemIcon>
                    <SettingsOutlined color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Settings' />
                </ListItem>
              </Link>
            </LightTooltip>
          )}
          <LightTooltip title='Logout' placement='top'>
            <ListItem button onClick={handleDialogOpen}>
              <ListItemIcon>
                <ExitToApp color='primary' />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          </LightTooltip>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {component}
      </main>
      {renderMobileMenu}
      {renderMenu}
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to logout?
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
            onClick={onLogout}
            variant='contained'
            color='primary'
            size='small'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
