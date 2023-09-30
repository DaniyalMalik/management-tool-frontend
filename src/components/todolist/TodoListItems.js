import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Box,
  Grid,
  Paper,
  ListItemText,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Dialog,
} from '@material-ui/core';
import {
  CheckBoxOutlineBlankOutlined,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  CheckBoxOutlined,
  AttachFile,
  ImageOutlined,
  CancelOutlined,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  getManyFromTodoList,
  updateTodoList,
  deleteTodoListItem,
} from '../../actions/actionCreators/todoListActions';
import EditTodoListItem from './EditTodoListItem';
import ViewTodoListItem from './ViewTodoListItem';
import { deleteTodoAttachment } from '../../actions/actionCreators/uploadActions';
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
  styledPaper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto',
    padding: 10,
    marginTop: 10,
    width: '100%',
    borderRadius: '10px',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function TodoListItems() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const { todos } = useSelector((state) => state.todos);
  const [selectedTodoItem, setSelectedTodoItem] = useState('');
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
      dispatch(getManyFromTodoList(user._id, token));
    }
  };

  useEffect(() => {
    getResponse();
  }, [token, user]);

  const onDeleteTodoItem = async () => {
    const res = await dispatch(deleteTodoListItem(selectedTodoItem._id, token));

    if (res?.success) {
      deleteTodoAttachment(selectedTodoItem?._id, token);
    }

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

  const onUpdate = async (id, done, subTodos, e) => {
    e.preventDefault();

    if (subTodos.length > 0) {
      subTodos.map((item) => (done ? (item.done = true) : (item.done = false)));

      const res = await dispatch(updateTodoList(id, { done, subTodos }, token));

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    } else {
      const res = await dispatch(updateTodoList(id, { done }, token));

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

  const onUpdateSingle = async (id, subTodoId, done, subDone, subTodos, e) => {
    e.preventDefault();

    subTodos.map((item) => item._id === subTodoId && (item.done = subDone));

    let check = true,
      arr = [];

    subTodos.map((item) => (item.done ? arr.push(true) : arr.push(false)));

    check = !arr.includes(false);

    if (!check && done) {
      const res = await dispatch(
        updateTodoList(id, { done: false, subTodos }, token),
      );

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    } else if (check && !done) {
      const res = await dispatch(
        updateTodoList(id, { done: true, subTodos }, token),
      );

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    } else {
      const res = await dispatch(updateTodoList(id, { subTodos }, token));

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

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = (item) => {
    setOpenDialog(true);
    setSelectedTodoItem(item);
  };

  return (
    <Box className={classes.display}>
      <ViewTodoListItem
        handleModal={handleModalInfo}
        todo={selectedTodoItem}
        open={openInfo}
      />
      <EditTodoListItem
        handleModal={handleModalEdit}
        todo={selectedTodoItem}
        open={openEdit}
      />
      <Grid container>
        {todos?.length > 0 ? (
          todos.map((todo, key) => (
            <Grid key={key} xs={12} item>
              <Paper key={key} className={classes.styledPaper} elevation={3}>
                <div>
                  <ListItemText
                    primary={todo?.name}
                    secondary={
                      // todo?.description.split('').length < 100 &&
                      // todo?.description.split('').map((description, key) => (
                      //   <div
                      //     dangerouslySetInnerHTML={{
                      //       __html: `${description}`,
                      //     }}
                      //   />
                      // ))
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `${todo?.description}`,
                        }}
                      />
                    }
                  />
                  {todo?.subTodos?.length > 0 &&
                    todo.subTodos.map((item) => (
                      <div className={classes.alignCenter}>
                        {item?.done ? (
                          <IconButton
                            aria-label='visibility'
                            onClick={(e) => {
                              dispatch(openLoader({ open: true }));
                              onUpdateSingle(
                                todo?._id,
                                item?._id,
                                todo?.done,
                                false,
                                todo?.subTodos,
                                e,
                              );
                            }}>
                            <CheckBoxOutlined color='primary' />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label='visibility'
                            onClick={(e) => {
                              dispatch(openLoader({ open: true }));
                              onUpdateSingle(
                                todo?._id,
                                item?._id,
                                todo?.done,
                                true,
                                todo?.subTodos,
                                e,
                              );
                            }}>
                            <CheckBoxOutlineBlankOutlined color='primary' />
                          </IconButton>
                        )}
                        <Typography variant='body1'>{item?.name}</Typography>
                      </div>
                    ))}
                  {todo?.filePath?.length > 0 && (
                    <AttachFile color='primary' fontSize='small' />
                  )}
                  {todo?.imagePath?.length > 0 && (
                    <ImageOutlined color='primary' fontSize='small' />
                  )}
                </div>
                <div>
                  {todo?.done ? (
                    <IconButton
                      aria-label='visibility'
                      onClick={(e) => {
                        dispatch(openLoader({ open: true }));
                        onUpdate(todo._id, false, todo?.subTodos, e);
                      }}>
                      <CheckBoxOutlined color='primary' />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label='visibility'
                      onClick={(e) => {
                        dispatch(openLoader({ open: true }));
                        onUpdate(todo._id, true, todo?.subTodos, e);
                      }}>
                      <CheckBoxOutlineBlankOutlined color='primary' />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label='visibility'
                    onClick={() => {
                      setSelectedTodoItem(todo);
                      handleModalInfo();
                    }}>
                    <VisibilityOutlined color='primary' />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    onClick={() => handleDialogOpen(todo)}>
                    <DeleteOutlined color='primary' />
                  </IconButton>
                  <IconButton
                    aria-label='edit'
                    onClick={() => {
                      setSelectedTodoItem(todo);
                      handleModalEdit();
                    }}>
                    <EditOutlined color='primary' />
                  </IconButton>
                </div>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant='h3'>No todo list items!</Typography>
        )}
      </Grid>
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Delete todo item permanently?
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
              onDeleteTodoItem();
            }}
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
