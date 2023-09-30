import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
  CancelOutlined,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Table,
  Button,
  TableBody,
  TableCell,
  Box,
  IconButton,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  TableRow,
  TableHead,
} from '@material-ui/core';
import {
  getCompaniesByOwner,
  deleteCompany,
} from '../../actions/actionCreators/companyActions';
import { deleteCompanyAttachment } from '../../actions/actionCreators/uploadActions';
import Company from './Company';
import EditCompany from './EditCompany';
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
  inline: {
    display: 'inline',
  },
  display: {
    display: 'flex',
    justifyContent: 'center',
  },
  styledTableContainer: {
    maxHeight: '500px',
  },
  styledPaper: {
    width: '100%',
  },
}));

export default function Comapies() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const { token, user } = useSelector((state) => state.user);
  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [company, setCompany] = useState('');

  const getResponse = async () => {
    if (user && token) {
      dispatch(getCompaniesByOwner(user._id, token));
    }
  };

  useEffect(() => {
    getResponse();
  }, [user, token]);

  const handleModalInfo = () => {
    setOpenInfo(!openInfo);
  };

  const handleDialogOpen = (data) => {
    setCompany(data);
    setOpenDialog(true);
  };

  const handleModalEdit = () => {
    setOpenEdit(!openEdit);
  };

  const onDeleteCompany = async () => {
    const res = await dispatch(deleteCompany(company?._id, token));
    await deleteCompanyAttachment(company?._id, token);

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

  return (
    <Box className={classes.display}>
      <Company
        handleModal={handleModalInfo}
        company={company}
        open={openInfo}
      />
      <EditCompany
        handleModal={handleModalEdit}
        company={company}
        open={openEdit}
      />
      <Paper className={classes.styledPaper}>
        <TableContainer className={classes.styledTableContainer}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell align='left' style={{ minWidth: 200 }}>
                  <b>Name</b>
                </TableCell>
                <TableCell align='left' style={{ minWidth: 200 }}>
                  <b>Email</b>
                </TableCell>
                <TableCell align='left' style={{ minWidth: 200 }}>
                  <b>Phone Number</b>
                </TableCell>
                <TableCell align='inherit' style={{ minWidth: 200 }}>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies?.length > 0 &&
                companies.map((company, key) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                    <TableCell key={key} align='left'>
                      {company?.name}
                    </TableCell>
                    <TableCell key={key} align='left'>
                      {company?.email}
                    </TableCell>
                    <TableCell key={key} align='left'>
                      {company?.phoneNumber}
                    </TableCell>
                    <TableCell key={key} align='left'>
                      <IconButton
                        aria-label='visibility'
                        onClick={() => {
                          setCompany(company);
                          handleModalInfo();
                        }}>
                        <VisibilityOutlined color='primary' />
                      </IconButton>
                      <IconButton
                        aria-label='delete'
                        onClick={(e) => {
                          handleDialogOpen(company);
                        }}>
                        <DeleteOutlined color='primary' />
                      </IconButton>
                      <IconButton
                        aria-label='edit'
                        onClick={() => {
                          setCompany(company);
                          handleModalEdit();
                        }}>
                        <EditOutlined color='primary' />
                      </IconButton>
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
            Delete company permanently?
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
            onClick={onDeleteCompany}
            variant='contained'
            color='primary'
            size='small'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
