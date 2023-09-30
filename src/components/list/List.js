import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  makeStyles,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { deleteCardAttachment } from '../../actions/actionCreators/uploadActions';
import {
  Add,
  DeleteOutlined,
  EditOutlined,
  CancelOutlined,
} from '@material-ui/icons';
import Card from '../card/Card';
import InputCard from '../card/InputCard';
import { createNewCard } from '../../actions/actionCreators/cardActions';
import midString from '../../ordering/ordering';
import { createNewActivity } from '../../actions/actionCreators/activityActions';
import AddItem from '../AddItem';
import { deleteListById } from '../../actions/actionCreators/listActions';
import ChangeListColor from '../list/ChangeListColor';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '272px',
    marginLeft: theme.spacing(1),
    wordWrap: 'break-word',
    borderRadius: 12,
    padding: 12,
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: '1',
  },
  edit: {
    position: 'absolute',
    right: 20,
    top: 0,
    zIndex: '1',
  },
  scroll: {
    maxHeight: '500px',
    overflow: 'auto',
    overflowX: 'hidden',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    height: '100%',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid green',
    },
  },
  title: {
    padding: theme.spacing(1, 1, 1, 1),
    minWidth: '100px',
    marginLeft: theme.spacing(1.5),
    fontWeight: 'bold',
    fontSize: 'small',
  },
  wrapper: {
    padding: 5,
  },
  editable: {
    marginLeft: theme.spacing(-1),
    wordWrap: 'break-word',
    padding: theme.spacing(0, 1, 0, 1),
    boxShadow: 'inset 0 0 0 2px #0079bf',
    width: '210px',
    borderRadius: 4,
  },
}));

export default function Column({
  column,
  tasks,
  index,
  currentBoard,
  updated,
}) {
  const classes = useStyles();
  const [cardTitle, setCardTitle] = useState('');
  const [addCardFlag, setAddCardFlag] = useState(false);
  const [list, setList] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isListEditor, setIsListEditor] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleDialog = () => {
    setOpen(!open);
  };

  useEffect(() => {
    user?._id &&
      column?._id &&
      column.user.map((u) => {
        if (u.userId._id === user?._id) {
          if (u?.role === 'Editor' || u?.role === 'Admin') {
            setIsListEditor(true);
          } else {
            setIsListEditor(false);
          }
        }
        return null;
      });
  }, [user, column]);

  const componentUpdated = () => {
    updated();
  };

  const handleChange = (e) => {
    e.preventDefault();

    setCardTitle(e.target.value);
  };

  const onDeleteList = async () => {
    setList(false);

    const res = await dispatch(deleteListById(column._id, token));
    const text = `${user.firstName + ' ' + user.lastName} deleted list ${
      column.name
    }`;
    deleteCardAttachment('list', column._id, currentBoard._id, token);
    dispatch(createNewActivity({ text, boardId: column.boardId }, token));
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

  const submitHandler = async () => {
    if (cardTitle === '') return;

    const text = cardTitle.trim().replace(/\s+/g, ' ');

    setCardTitle(text);

    const totalTasks = tasks.length;
    const postCardReq = {
      name: text,
      companyId: user?.companyId ? user.companyId : user.employId,
      user: column.user,
      boardId: column.boardId,
      listId: column._id,
      order:
        totalTasks === 0 ? 'n' : midString(tasks[totalTasks - 1].order, ''),
    };

    await dispatch(createNewCard(postCardReq, token));
    await dispatch(
      createNewActivity(
        {
          text: `${user.firstName + ' ' + user.lastName} added ${text} to ${
            column.name
          }`,
          boardId: column.boardId,
        },
        token,
      ),
    );
    componentUpdated();
    setCardTitle('');
  };

  const handleAddition = () => {
    setAddCardFlag(true);
  };

  const closeButtonHandler = () => {
    setAddCardFlag(false);
    setCardTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitHandler();
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  return (
    <div className={classes.wrapper} id={index}>
      <ChangeListColor
        open={open}
        toggleDialog={toggleDialog}
        currBoard={currentBoard}
        list={column}
      />
      {list && (
        <Draggable
          isDragDisabled={
            currentBoard?.type === 'Template' ? true : !isListEditor
          }
          horizontal={true}
          draggableId={column._id}
          index={index}>
          {(provided) => (
            <div {...provided.draggableProps} ref={provided.innerRef}>
              <Paper
                elevation={0}
                className={classes.root}
                style={{
                  background: `linear-gradient(to top, white 80%, ${
                    column?.color ? column.color : 'white'
                  } 20%)`,
                }}
                {...provided.dragHandleProps}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div className={classes.title}>{column.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant='body2'
                      style={{ padding: '5px', fontSize: 'small' }}>
                      <b>{tasks.length}</b>
                    </Typography>
                    {currentBoard?.type === 'Custom' && isListEditor && (
                      <>
                        <IconButton
                          color='primary'
                          size='small'
                          // className={classes.edit}
                          onClick={toggleDialog}>
                          <EditOutlined fontSize='small' />
                        </IconButton>
                        <IconButton
                          size='small'
                          color='primary'
                          // className={classes.delete}
                          onClick={handleDialogOpen}>
                          <DeleteOutlined fontSize='small' />
                        </IconButton>
                      </>
                    )}
                    {currentBoard?.type === 'Template' && isListEditor && (
                      <IconButton
                        size='small'
                        color='primary'
                        // className={classes.edit}
                        onClick={toggleDialog}>
                        <EditOutlined fontSize='small' />
                      </IconButton>
                    )}
                  </div>
                </div>
                <Droppable
                  isDropDisabled={!isListEditor}
                  droppableId={column._id}
                  type='card'>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <div className={classes.scroll}>
                        {tasks.map((task, key) => (
                          <Card
                            key={key}
                            column={column}
                            updated={componentUpdated}
                            currentBoard={currentBoard}
                            task={task}
                            imagePath={task?.imagePath}
                            filePath={task?.filePath}
                            videoPath={task?.videoPath}
                            index={key}
                          />
                        ))}
                        {addCardFlag && (
                          <InputCard
                            value={cardTitle}
                            changedHandler={handleChange}
                            itemAdded={submitHandler}
                            closeHandler={closeButtonHandler}
                            keyDownHandler={handleKeyDown}
                            type='card'
                            btnText='Add Card'
                            placeholder='Enter a title for this card...'
                            width='230px'
                          />
                        )}
                        {provided.placeholder}
                      </div>
                      {!addCardFlag && isListEditor && (
                        <AddItem
                          handleClick={handleAddition}
                          icon={<Add color='primary' />}
                          btnText='Add another card'
                          type='card'
                          width='230px'
                        />
                      )}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </div>
          )}
        </Draggable>
      )}
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Delete list permanently?
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
              onDeleteList();
            }}
            variant='contained'
            color='primary'
            size='small'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
