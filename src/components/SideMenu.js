import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import {
  DeleteOutline,
  AccountTree,
  MoreHoriz,
  CancelOutlined,
  DeleteForever,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import AddItem from './AddItem';
import Activities from './Utilities/Activities';
import Hr from './Hr';
import MenuHeader from './MenuHeader';
import Background from './Utilities/Background';
import { deleteBoardById } from '../actions/actionCreators/boardActions';
import { deleteBoardAttachment } from '../actions/actionCreators/uploadActions';
import { openSnackbar } from '../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#ffffff',
    width: '321px',
    float: 'right',
    height: '100vh',
    right: (props) =>
      props.showMenu === false ? theme.spacing(-100) : theme.spacing(0),
    top: theme.spacing(8),
    borderRadius: theme.spacing(0),
    position: 'fixed',
    padding: theme.spacing(1),
    wordWrap: 'break-word',
    zIndex: '1200',
    transition: 'right 0.7s ease-out',
  },
  scroll: {
    overflow: 'auto',
    height: '95vh',
  },
}));

export default function SideMenu({ setBackground }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { currBoard } = useSelector((state) => state.boards);
  const classes = useStyles({ showMenu });
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { token, user } = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDialogClose = () => {
    setDeleting(false);
  };

  useEffect(() => {
    if (currBoard?._id && user?._id) {
      currBoard.user.map((u) => {
        user._id === u.userId._id && u.role === 'Admin' && setIsAdmin(true);
      });
    }
  }, [currBoard, user]);

  return (
    <div>
      <div style={{ position: 'fixed', top: '75px', right: '0' }}>
        <AddItem
          handleClick={() => setShowMenu(true)}
          icon={<MoreHoriz />}
          type='menu'
          width='2px'
          color='white'
        />
      </div>
      {!showBackground && (
        <Paper className={classes.container} elevation={1} variant='outlined'>
          <MenuHeader
            text='Menu'
            closeHandler={() => setShowMenu(false)}
            type='menu'
          />
          <Hr />
          {currBoard?.type === 'Custom' && (
            <AddItem
              btnText='Change Background'
              handleClick={() => setShowBackground(true)}
              type='background'
              width='310px'
              icon={
                <span
                  style={{
                    marginRight: '13px',
                    backgroundColor: `${currBoard?.image?.color}`,
                    backgroundImage: `url(${currBoard?.image?.full})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '20px',
                    height: '20px',
                    borderRadius: '2px',
                  }}></span>
              }
            />
          )}
          {isAdmin && (
            <AddItem
              btnText='Delete Board'
              handleClick={() => setDeleting(true)}
              type='background'
              width='310px'
              icon={
                <DeleteOutline
                  style={{ marginRight: '10px', color: '#183569' }}
                />
              }
            />
          )}
          <Dialog
            open={deleting}
            fullWidth
            onClose={() => handleDialogClose()}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>
            <DialogTitle id='alert-dialog-title'>Alert</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Delete {currBoard?.name} board permanently?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<CancelOutlined />}
                variant='contained'
                onClick={() => handleDialogClose()}
                size='small'>
                No
              </Button>
              <Button
                onClick={async () => {
                  dispatch(openLoader({ open: true }));

                  const res = await dispatch(deleteBoardById(id, token));

                  deleteBoardAttachment(id, token);
                  handleDialogClose();
                  dispatch(
                    openSnackbar({
                      open: true,
                      message: res?.message,
                      severity: res?.success,
                    }),
                  );
                  dispatch(closeLoader());

                  history.push(
                    `/${user?.firstName + ' ' + user?.lastName}/home`,
                  );
                }}
                startIcon={<DeleteForever />}
                variant='contained'
                color='primary'
                size='small'>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <AccountTree
              fontSize='small'
              style={{ paddingLeft: '20px', color: '#172B4D', opacity: '0.8' }}
            />
            <div
              style={{
                paddingLeft: '10px',
                paddingBottom: '10px',
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#172B4D',
                opacity: '0.9',
              }}>
              Activities
            </div>
          </div>
          <div className={classes.scroll}>
            <Activities board={{ id }} />
          </div>
        </Paper>
      )}
      <div>
        {showBackground && (
          <Background
            backHandler={() => setShowBackground(false)}
            closeHandler={() => {
              setShowMenu(false);
              setShowBackground(false);
            }}
            setColorBackground={setBackground}
          />
        )}
      </div>
    </div>
  );
}
