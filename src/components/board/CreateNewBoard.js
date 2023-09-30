import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  Dialog,
  TextField,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import defaultImage from '../../assets/bg4.png';
import image from '../../assets/create.png';
import { Close } from '@material-ui/icons';
import {
  createNewBoard,
  countBoards,
} from '../../actions/actionCreators/boardActions';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';
import AlertModal from '../Utilities/Alert';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
  colorcard: {
    height: '32px',
    width: '20%',
    margin: theme.spacing(0.7),
    borderRadius: theme.spacing(1),
    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    },
  },
}));

export default function CreateNewBoard({
  toggleModal,
  open,
  update,
  handleUpdated,
  handleRefresh,
}) {
  const classes = useStyles();
  const colors = [
    'rgb(0, 121, 191)',
    'rgb(210, 144, 52)',
    'rgb(81, 152, 57)',
    'rgb(176, 70, 50)',
    'rgb(137, 96, 158)',
    'rgb(205, 90, 145)',
    '#b2102f',
    '#cda311',
    '#009688',
    'rgb(255, 109, 109)',
    'rgb(233, 231, 0)',
  ];
  const [boardColor, setBoardColor] = useState('');
  const { token, user } = useSelector((state) => state.user);
  const { boardsCount } = useSelector((state) => state.boards);
  const dispatch = useDispatch();
  const [boardTitle, setBoardTitle] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) setTimeout(() => setShow(true), 3000);
  }, [open]);

  useEffect(() => {
    if (user?._id && boardsCount) {
      if (user?.companyId?.subscription === 'Bronze') {
        setLimit('(' + boardsCount + '/' + 15 + ')');
      } else if (user?.companyId?.subscription === 'Silver') {
        setLimit('(' + boardsCount + '/' + 50 + ')');
      } else {
        setLimit('');
      }
    }
  }, [user, boardsCount]);

  useEffect(() => {
    if (user?._id && boardsCount) {
      if (user?.companyId?.subscription === 'Bronze' && boardsCount === 15) {
        setDisabled(true);
      } else if (
        user?.companyId?.subscription === 'Silver' &&
        boardsCount === 50
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [user, boardsCount]);

  useEffect(() => {
    countPersonalBoards();
  }, [token, refresh, update]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [token]);

  const handleChange = (e) => {
    setBoardTitle(e.target.value);
  };

  const handleAlert = () => {
    setOpenAlert(!alert);
  };

  const countPersonalBoards = (e) => {
    if (token) {
      dispatch(countBoards(token));
    }

    setRefresh(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (boardTitle === '') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const postBoardReq = {
      name: boardTitle,
      companyId: user?.companyId ? user?.companyId : user?.employId,
      user: [{ userId: user?._id, role: 'Admin' }],
      image: {
        color: boardColor ? boardColor : 'white',
        thumb: boardColor ? '' : defaultImage,
        full: boardColor ? '' : defaultImage,
      },
    };

    const res = await dispatch(createNewBoard(postBoardReq, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (handleUpdated !== undefined) {
      handleUpdated();
    } else {
      handleRefresh();
    }

    setBoardTitle('');
    setBoardColor('');
    setRefresh(false);
    toggleModal();
  };

  return (
    <div>
      {disabled && open && show && (
        <AlertModal
          alert='You have reached the limit!'
          message='You have reached the limit of maximum boards for your account! Try our Golden Subscription for no limits!'
          open={openAlert}
          handleAlert={handleAlert}
        />
      )}
      <Dialog open={open} onClose={toggleModal}>
        <DialogTitle>
          <IconButton style={{ float: 'right' }} onClick={toggleModal}>
            <Close fontSize='small' />
          </IconButton>
          <Typography
            style={{ textAlign: 'center', fontWeight: '600' }}
            variant='h5'>
            Create New Board
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <img src={image} />
          </DialogContentText>
          <form onSubmit={submitHandler}>
            <TextField
              autoFocus
              label='Board Title'
              value={boardTitle}
              fullWidth
              onChange={handleChange}
              variant='outlined'
            />
            <div className={classes.cardContainer}>
              {colors.map((color) => (
                <div
                  className={classes.colorcard}
                  key={color}
                  style={{ backgroundColor: color }}
                  onClick={() => setBoardColor(color)}
                />
              ))}
              <div
                style={{
                  padding: '10px',
                  display: 'contents',
                }}>
                {/* <Typography variant="h6">Default Background:</Typography> */}
                <div
                  className={classes.colorcard}
                  style={{
                    backgroundImage: `url(${defaultImage})`,
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  Default
                </div>
              </div>
            </div>
            <Button
              style={{ float: 'right', margin: '10px' }}
              color='primary'
              variant='contained'
              size='small'
              type='submit'
              disabled={disabled}
              onClick={() => dispatch(openLoader({ open: true }))}>
              Create {limit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
