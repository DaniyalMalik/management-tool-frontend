import React, { useRef, useState, useEffect } from 'react';
import {
  makeStyles,
  IconButton,
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { Close } from '@material-ui/icons';
import Email from '../features/Email';
import AddBoardMember from './AddBoardMember';
import RemoveBoardMember from '../board/RemoveBoardMember';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Utilities/Loader';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  scrollButtonBar: {
    padding: '20px',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    minWidth: '100%',
  },
  close: {
    color: theme.palette.grey[500],
    float: 'right',
  },
  description: {
    display: 'flex',
    justifuyContent: 'flexStart',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
}));

export default function BoardInvite({
  modalOpen,
  handleModal,
  componentUpdated,
}) {
  const classes = useStyles();
  const { currBoard } = useSelector((state) => state.boards);
  const { user, token } = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const descriptionElementRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token));
    }
  }, [token]);

  useEffect(() => {
    if (currBoard?._id && user?._id) {
      currBoard.user.map((u) => {
        user._id === u.userId._id &&
          (u.role === 'Admin' || u.role === 'Editor') &&
          setIsAdmin(true);
      });
    }
  }, [currBoard, user]);

  return (
    <Dialog
      maxWidth={'xs'}
      maxHeight={'xs'}
      open={modalOpen}
      onClose={handleModal}
      scroll='paper'
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'>
      <DialogTitle id='scroll-dialog-title'>
        <>
          <IconButton
            size='small'
            className={classes.close}
            onClick={handleModal}>
            <Close fontSize='small' />
          </IconButton>
          <Typography variant='h6'>Invite</Typography>
        </>
      </DialogTitle>
      <DialogContent dividers='paper'>
        <DialogContentText
          id='scroll-dialog-description'
          ref={descriptionElementRef}
          tabIndex={-1}>
          {loader ? <Loader open={loader} /> : null}
          <AddBoardMember componentUpdated={componentUpdated} />
          <Divider />
          <Email />
          <Divider />
          {isAdmin && <RemoveBoardMember componentUpdated={componentUpdated} />}
          <Divider />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
