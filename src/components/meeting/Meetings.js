import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  IconButton,
  TableRow,
  TableHead,
  TableContainer,
  Box,
  TableBody,
  Table,
  Paper,
  TableCell,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Dialog,
} from '@material-ui/core';
import {
  EditOutlined,
  DeleteOutlined,
  CancelOutlined,
  VisibilityOutlined,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  getManyFromMeeting,
  deleteFromMeeting,
} from '../../actions/actionCreators/meetingActions';
import EditMeeting from './EditMeeting';
import ViewMeeting from './ViewMeeting';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  display: {
    display: 'flex',
    justifyContent: 'center',
  },
  styledPaper: {
    width: '70vw',
  },
  styledTableContainer: {
    maxHeight: '500px',
  },
  inline: {
    display: 'inline',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Meetings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const { meetings } = useSelector((state) => state.meetings);
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleModalEdit = () => {
    setOpenEdit(!openEdit);
  };

  const handleModalInfo = () => {
    setOpenInfo(!openInfo);
  };

  const getResponse = () => {
    if (user?._id && token) {
      dispatch(getManyFromMeeting(user._id, token));
    }
  };

  useEffect(() => {
    getResponse();
  }, [token, user]);

  const onDeleteMeeting = async () => {
    const res = await dispatch(deleteFromMeeting(selectedMeeting._id, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = (item) => {
    setOpenDialog(true);
    setSelectedMeeting(item);
  };

  return (
    <>
      <Box className={classes.display}>
        <ViewMeeting
          handleModal={handleModalInfo}
          meeting={selectedMeeting}
          open={openInfo}
        />
        <EditMeeting
          handleModal={handleModalEdit}
          meeting={selectedMeeting}
          open={openEdit}
        />
        <Paper className={classes.styledPaper}>
          <TableContainer className={classes.styledTableContainer}>
            <Table
              stickyHeader
              aria-label='sticky table'
              className={classes.styledTable}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Topic</b>
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Date and Time</b>
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Type</b>
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Members</b>
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Scheduled At</b>
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ minWidth: 50, maxWidth: 200 }}>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings?.length > 0 &&
                  meetings.map((meeting, key) => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                      <TableCell key={key} align='center'>
                        {meeting?.topic}
                      </TableCell>
                      <TableCell key={key} align='center'>
                        <span
                          style={{
                            color:
                              new Date().getTime() >
                              new Date(meeting.dateAndTime).getTime()
                                ? '#ca0000'
                                : '#51b300',
                          }}>
                          {new Date(meeting?.dateAndTime).toLocaleString(
                            'en-US',
                            {
                              hour12: false,
                            },
                          )}
                        </span>
                      </TableCell>
                      <TableCell key={key} align='center'>
                        {meeting?.type}
                      </TableCell>
                      <TableCell key={key} align='center'>
                        {meeting?.user?.length > 0 &&
                          meeting?.user?.map(
                            (u) =>
                              u.userId._id !== user._id &&
                              u?.userId?.firstName +
                                ' ' +
                                u?.userId?.lastName +
                                ', ',
                          )}
                      </TableCell>
                      <TableCell key={key} align='center'>
                        {new Date(meeting?.createdAt).toLocaleString('en-US', {
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell key={key} align='center'>
                        <IconButton
                          aria-label='visibility'
                          onClick={() => {
                            setSelectedMeeting(meeting);
                            handleModalInfo();
                          }}>
                          <VisibilityOutlined color='primary' />
                        </IconButton>
                        {meeting?.user?.length > 0 &&
                          meeting.user.map(
                            (u) =>
                              u.userId._id === user._id &&
                              u.role === 'Scheduler' && (
                                <>
                                  <IconButton
                                    aria-label='delete'
                                    onClick={() => handleDialogOpen(meeting)}>
                                    <DeleteOutlined color='primary' />
                                  </IconButton>
                                  <IconButton
                                    aria-label='edit'
                                    onClick={() => {
                                      setSelectedMeeting(meeting);
                                      handleModalEdit();
                                    }}>
                                    <EditOutlined color='primary' />
                                  </IconButton>
                                </>
                              ),
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog
          fullWidth
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Delete meeting permanently?
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
                onDeleteMeeting();
              }}
              variant='contained'
              color='primary'
              size='small'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
