import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ChatApp from '../components/chat/ChatApp';
import {
  ChatOutlined,
  FullscreenExit,
  Fullscreen,
  CreateOutlined,
} from '@material-ui/icons';
import App from '../App';
import { Fab, Tooltip, Box } from '@material-ui/core';
import InvitedBoards from '../components/board/InvitedBoards';
import Templates from '../components/board/Templates';
import CompanyDashboard from '../components/company/CompanyDashboard';
import PersonalBoards from '../components/board/PersonalBoards';
import Board from '../components/board/Board';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Test_1 from '../components/Utilities/Test_1';
import Test_2 from '../components/Utilities/Test_2';
import NotFound from '../components/Utilities/NotFound';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Settings from '../components/settings/Settings';
import Profile from '../components/user/Profile';
import Favourites from '../components/board/Favourites';
import { Main } from '../components/cvBuilder/Main';
import Landing from '../components/Landing/App';
import Meeting from '../components/meeting/Meeting';
import TodoList from '../components/todolist/TodoList';
import Task from '../components/task/Main';
import {
  checkTokenValidity,
  fetchUserInfo,
} from '../actions/actionCreators/userActions';
import {
  createTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import SnacbarAndLoader from '../components/Utilities/Snacbar';
import Loader from '../components/Utilities/Loader';
import CompanyModal from '../components/company/CompanyModal';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

function History() {
  const history = useHistory();
  const location = useLocation();
  const { isValid, token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isValid && token) {
      dispatch(fetchUserInfo(token));
    }
  }, [isValid, token, dispatch]);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    let token = localStorage.getItem('bizstruc-token');

    if (
      !token &&
      location.pathname !== '/' &&
      location.pathname !== '/test_1' &&
      location.pathname !== '/test_2' &&
      location.pathname !== '/register' &&
      location.pathname !== '/register/' &&
      location.pathname !== '/forgotpassword' &&
      location.pathname.split('/')[1] !== 'resetpassword'
    ) {
      localStorage.removeItem('bizstruc-token');

      token = '';

      history.push('/');
    }

    if (token) dispatch(checkTokenValidity(token));
    //* eslint-disable next-line *//
  }, [user]);

  return <div></div>;
}

const useStyles = makeStyles((theme) => ({
  floatingButton_1: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#ffffff',
    opacity: '0.5',
    '&:hover': {
      backgroundColor: '#ffffff',
      opacity: '1',
    },
  },
  floatingButton_2: {
    position: 'fixed',
    backgroundColor: '#ffffff',
    bottom: '100px',
    right: '30px',
    opacity: '0.5',
    '&:hover': {
      backgroundColor: '#ffffff',
      opacity: '1',
    },
  },
}));

const AppRouter = () => {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const [fullscreen, setFullscreen] = useState(false);
  const [show, setShow] = useState(false);
  const [createCompany, setCreateCompany] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = createTheme({
    palette: {
      primary: {
        light: '#183569',
        main: '#183569',
        dark: '#183569',
      },
      secondary: {
        light: '#ffd95a',
        main: '#f9a825',
        dark: '#c17900',
        contrastText: '#212121',
      },
      background: {
        default: '#ffffff',
      },
    },
    typography: {
      useNextVariants: true,
    },
  });

  useEffect(() => {
    if (!window.location.href.split('/')[3]) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChanged, false);
    document.addEventListener(
      'mozfullscreenchange',
      onFullscreenChanged,
      false,
    );
    document.addEventListener(
      'webkitfullscreenchange',
      onFullscreenChanged,
      false,
    );
    document.addEventListener('msfullscreenchange', onFullscreenChanged, false);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        onFullscreenChanged,
        false,
      );
      document.removeEventListener(
        'mozfullscreenchange',
        onFullscreenChanged,
        false,
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        onFullscreenChanged,
        false,
      );
      document.removeEventListener(
        'msfullscreenchange',
        onFullscreenChanged,
        false,
      );
    };
  }, []);

  const openFullscreen = () => {
    const elem = document.documentElement;

    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem?.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem?.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem?.msRequestFullscreen) {
      /* IE11 */
      elem = window.top.document.body;
      elem.msRequestFullscreen();
    }
  };

  function closeFullscreen() {
    if (document?.exitFullscreen) {
      document.exitFullscreen();
    } else if (document?.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document?.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document?.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
      window.top.document.msExitFullscreen();
    }
  }

  const onFullscreenChanged = () => {
    setFullscreen((prevVal) => !prevVal);
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const openCreateCompanyModal = () => {
    setCreateCompany(true);
  };

  const closeCreateCompanyModal = () => {
    setCreateCompany(false);
  };

  return (
    <Box>
      <CompanyModal open={createCompany} closeModal={closeCreateCompanyModal} />
      <Loader />
      <SnacbarAndLoader />
      <ChatApp modalOpen={modalOpen} handleModal={handleModal} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Switch>
            <Route path='/:user/settings' exact component={Settings} />
            <Route path='/:user/meetings' exact component={Meeting} />
            <Route path='/:user/todos' exact component={TodoList} />
            <Route path='/:user/tasks' exact component={Task} />
            <Route path='/test_1' exact component={Test_1} />
            <Route path='/test_2' exact component={Test_2} />
            <Route path='/:user/home' exact component={App} />
            <Route path='/:user/boards' exact component={PersonalBoards} />
            <Route
              path='/:user/invitedboards'
              exact
              component={InvitedBoards}
            />
            <Route path='/:user/templates' exact component={Templates} />
            <Route path='/createcompany' exact component={CompanyDashboard} />
            <Route path='/:user/favourites' exact component={Favourites} />
            <Route path='/board/:id/:name' exact component={Board} />
            {/* <Route path='/:user/cvbuilder' exact component={Main} /> */}
            <Route path='/:user/profile/:id' exact component={Profile} />
            <Route
              path='/resetpassword/:forgotPasswordToken'
              exact
              component={ResetPassword}
            />
            <Route path='/forgotpassword' exact component={ForgotPassword} />
            <Route path='/' exact component={Login} />
            <Route path='/register' exact component={Register} />
            <Route component={NotFound} />
          </Switch>
          <History />
        </BrowserRouter>
      </ThemeProvider>
      {show &&
        (!fullscreen ? (
          <LightTooltip title='Fullscreen'>
            <Fab className={classes.floatingButton_1} onClick={openFullscreen}>
              <Fullscreen color='primary' />
            </Fab>
          </LightTooltip>
        ) : (
          <LightTooltip title='Fullscreen'>
            <Fab className={classes.floatingButton_1} onClick={closeFullscreen}>
              <FullscreenExit color='primary' />
            </Fab>
          </LightTooltip>
        ))}
      {/* {show && user?._id && !user?.employId && !user?.companyId && (
        <LightTooltip title='Create Company'>
          <Fab
            className={classes.floatingButton_2}
            onClick={openCreateCompanyModal}>
            <CreateOutlined color='primary' />
          </Fab>
        </LightTooltip>
      )} */}
      {/* {show && user && (user?.employId || user?.companyId) && (
        <LightTooltip title='Chat'>
          <Fab className={classes.floatingButton_2} onClick={handleModal}>
            <ChatOutlined color='primary' />
          </Fab>
        </LightTooltip>
      )} */}
    </Box>
  );
};

export default AppRouter;
