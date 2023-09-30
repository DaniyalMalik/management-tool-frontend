import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  Avatar,
  Box,
  DialogActions,
  Dialog,
  DialogContent,
  Button,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@material-ui/core';
import {
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
  CancelOutlined,
  DeleteForever,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteUser,
  getAllUsersByEmployId,
  getcompanyuserscount,
} from '../../actions/actionCreators/userActions';
import { deleteUserAttachment } from '../../actions/actionCreators/uploadActions';
import InviteUser from './InviteUser';
import User from './User';
import EditUser from './EditUser';
import AlertModal from '../Utilities/Alert';
import AddUser from './AddUser';
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
  styledTableContainer: {
    maxHeight: '500px',
  },
  styledPaper: {
    width: '100%',
  },
  inline: {
    display: 'inline',
  },
  display: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  responsiveButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    margin: '2px',
    width: '100%',
  },
}));

export default function Users() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, companyUsers, user, usersCount } = useSelector(
    (state) => state.user,
  );
  const [selectedUser, setSelectedUser] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [userId, setUserId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [limit, setLimit] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user?._id && (user?.companyId?._id || user?.employId?._id)) {
      dispatch(
        getcompanyuserscount(
          user?.companyId?._id ? user.companyId._id : user?.employId?._id,
          token,
        ),
      );
    }

    setRefresh(false);
  }, [user, refresh]);

  useEffect(() => {
    if (user?._id && usersCount) {
      if (user?.companyId?.subscription === 'Bronze' && usersCount === 15) {
        setDisabled(true);
      } else if (
        user?.companyId?.subscription === 'Silver' &&
        usersCount === 50
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [user, usersCount]);

  useEffect(() => {
    if (user?._id && usersCount) {
      if (user?.companyId?.subscription === 'Bronze') {
        setLimit('(' + usersCount + '/' + 15 + ')');
      } else if (user?.companyId?.subscription === 'Silver') {
        setLimit('(' + usersCount + '/' + 50 + ')');
      } else {
        setLimit('');
      }
    }
  }, [user, usersCount]);

  const handleAlert = () => {
    setOpenAlert(!alert);
  };

  const handleRefresh = () => {
    setRefresh(true);
  };

  const handleModalInfo = () => {
    setOpenInfo(!openInfo);
  };

  const handleModalEdit = () => {
    setOpenEdit(!openEdit);
  };

  const handleModalAdd = () => {
    setOpenAdd(!openAdd);
  };

  const getResponse = async () => {
    if (user?.companyId?._id) {
      dispatch(getAllUsersByEmployId(user.companyId._id, token));
    }
  };

  const handleDialogOpen = (id, companyId) => {
    setUserId(id);
    setCompanyId(companyId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setUserId('');
    setOpenDialog(false);
  };

  useEffect(() => {
    getResponse();
  }, [token, user]);

  const onDeleteUser = async () => {
    const res = await dispatch(deleteUser(userId, token));

    res?.success && deleteUserAttachment(userId, companyId, token);

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    setRefresh(true);
    await handleDialogClose();
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <InviteUser modalOpen={modalOpen} handleModal={handleModal} />
      <Box className={classes.display}>
        {disabled && (
          <AlertModal
            alert='You have reached the limit!'
            message='You have reached the limit of maximum users for your company! Try our Golden Subscription for no limits!'
            open={openAlert}
            handleAlert={handleAlert}
          />
        )}
        <User
          handleModal={handleModalInfo}
          user={selectedUser}
          open={openInfo}
        />
        <EditUser
          handleModal={handleModalEdit}
          user={selectedUser}
          open={openEdit}
        />
        <AddUser
          handleRefresh={handleRefresh}
          handleModal={handleModalAdd}
          open={openAdd}
        />
        <Dialog
          fullWidth
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Delete user permanently, this will delete all user data?
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
              startIcon={<DeleteForever />}
              onClick={() => {
                dispatch(openLoader({ open: true }));
                onDeleteUser();
              }}
              variant='contained'
              color='primary'
              size='small'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.styledPaper}>
          <TableContainer className={classes.styledTableContainer}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' style={{ minWidth: 200 }}>
                    <b>Name</b>
                  </TableCell>
                  <TableCell align='center' style={{ minWidth: 200 }}>
                    <b>Email</b>
                  </TableCell>
                  <TableCell align='center' style={{ minWidth: 200 }}>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyUsers?.length > 0 &&
                  companyUsers.map(
                    (companyUser, key) =>
                      companyUser?._id !== user?._id && (
                        <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                          <TableCell key={key} align='center'>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Avatar
                                alt={
                                  companyUser?.firstName +
                                  ' ' +
                                  companyUser?.lastName
                                }
                                src={companyUser?.imagePath}>
                                {!companyUser?.imagePath &&
                                  companyUser?.firstName?.split('')[0]}
                              </Avatar>
                              &nbsp; &nbsp;
                              <span>
                                {companyUser?.firstName +
                                  ' ' +
                                  companyUser?.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell key={key} align='center'>
                            <div>
                              <span>{companyUser?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell key={key} align='center'>
                            <IconButton
                              aria-label='visibility'
                              onClick={() => {
                                setSelectedUser(companyUser);
                                handleModalInfo();
                              }}>
                              <VisibilityOutlined color='primary' />
                            </IconButton>
                            <IconButton
                              aria-label='delete'
                              onClick={() =>
                                handleDialogOpen(
                                  companyUser._id,
                                  companyUser?.companyId
                                    ? companyUser.companyId
                                    : companyUser?.employId,
                                )
                              }>
                              <DeleteOutlined color='primary' />
                            </IconButton>
                            <IconButton
                              aria-label='edit'
                              onClick={() => {
                                setSelectedUser(companyUser);
                                handleModalEdit();
                              }}>
                              <EditOutlined color='primary' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ),
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        &nbsp;
        <div className={classes.responsiveButtons}>
          <Button
            variant='contained'
            size='small'
            className={classes.button}
            onClick={handleModalAdd}
            disabled={disabled}
            color='primary'>
            Add User {limit}
          </Button>
          <Button
            variant='contained'
            className={classes.button}
            size='small'
            onClick={handleModal}
            color='primary'>
            Invite New User
          </Button>
        </div>
      </Box>
    </>
  );
}
