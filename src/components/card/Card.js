import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  makeStyles,
  InputBase,
  IconButton,
  Box,
  CardMedia,
  Divider,
  Card as MaterialUICard,
  Typography,
  Button,
  DialogActions,
  DialogContentText,
  DialogContent,
  Tooltip,
  DialogTitle,
  Dialog,
} from '@material-ui/core';
import {
  AttachFile,
  DescriptionOutlined,
  EditOutlined,
  CancelOutlined,
  DeleteOutlined,
  PieChartOutlined,
  OndemandVideoOutlined,
  ImageOutlined,
  AssignmentOutlined,
  PeopleAltOutlined,
  CommentOutlined,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCardByIdPatch,
  deleteCardById,
} from '../../actions/actionCreators/cardActions';
import { fetchCardsFromBoard } from '../../actions/actionCreators/boardActions';
import { getTasksByCardId } from '../../actions/actionCreators/taskActions';
import { deleteCardAttachment } from '../../actions/actionCreators/uploadActions';
import { createNewActivity } from '../../actions/actionCreators/activityActions';
import Feature from '../features/Feature';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  autoCompleteRoot: {
    maxWidth: '1000px',
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  root: {
    maxWidth: 345,
  },
  formRoot: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  textBoxSize: {
    minWidth: '60%',
  },
  flexFormRoot: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridRoot: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  card: {
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(1),
    width: '230px',
    wordWrap: 'break-word',
    zIndex: '-100',
    borderRadius: 12,
    '&:hover': {
      backgroundColor: '#EBECF0',
    },
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  edit: {
    right: 20,
    top: 0,
    position: 'absolute',
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
  close: {
    right: 50,
    top: 40,
    position: 'absolute',
    zIndex: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  customTextField: {
    width: 200,
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

export default function Card({
  task,
  index,
  currentBoard,
  imagePath,
  filePath,
  videoPath,
  updated,
  column,
}) {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(task.name);
  const [card, setCard] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    checkboxes: [],
    tasksCount: 0,
    checkedCount: 0,
    refresh: false,
    users: [],
  });
  const { refresh, checkboxes, tasksCount, checkedCount, users } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const { activities } = useSelector((state) => state.activities);
  const openPopover = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const [isCardEditor, setIsCardEditor] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (task?.user?.length > 0) {
      task.user.map((u) => {
        if (u?.userId?._id === user?._id) {
          if (u?.role === 'Editor' || u?.role === 'Admin') {
            setIsCardEditor(true);
          } else {
            setIsCardEditor(false);
          }
        }
        return;
      });
    }
  }, [task, user]);

  useEffect(() => {
    if (token && user?._id && !task?.user[0]?.userId?._id)
      dispatch(fetchCardsFromBoard(currentBoard?._id, token));
  }, [token, task, user]);

  const handleClose = () => {
    setOpen(false);
  };

  const getResponse = async () => {
    let count = 0,
      checked = 0;

    const res = await dispatch(getTasksByCardId(task._id, token));

    if (res?.tasks?.length > 0) {
      res.tasks.map(
        (task) => (
          task.checked === true ? (checked = checked + 1) : null,
          (count = count + 1)
        ),
      );
    }

    setState({
      ...state,
      checkboxes: res?.tasks,
      tasksCount: count,
      refresh: false,
      checkedCount: checked,
    });
  };

  useEffect(() => {
    if (task?._id && token) {
      getResponse();
    }
  }, [task, token, refresh, imagePath, filePath, videoPath]);

  const componentUpdated = () => {
    setState({ ...state, refresh: true });

    updated();
  };

  const updateComponent = () => {
    setState({ ...state, refresh: true });
  };

  const onDeleteCard = async () => {
    setCard(false);

    const res = await dispatch(deleteCardById(task._id, token));

    deleteCardAttachment('card', task._id, currentBoard._id, token);
    componentUpdated();

    const text = `${user.firstName + ' ' + user.lastName} deleted card ${
      task.name
    }`;

    dispatch(createNewActivity({ text, boardId: task.boardId }, token));
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

  return (
    <LightTooltip title={activities[0]?.text}>
      <Box
        aria-haspopup='true'
        aria-owns={openPopover ? 'mouse-over-popover' : undefined}>
        <Draggable
          isDragDisabled={!isCardEditor}
          draggableId={task._id}
          index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}>
              {card && (
                <Paper className={classes.card}>
                  {imagePath?.length > 0 && (
                    <>
                      <MaterialUICard className={classes.root}>
                        <CardMedia
                          className={classes.media}
                          image={imagePath[0]}
                        />
                      </MaterialUICard>
                      <Divider />
                    </>
                  )}
                  <br />
                  {/* {videoPath?.length > 0 && (
                    <video controls style={{ width: '100%', height: 'auto' }}>
                      <source src={videoPath[0]} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  )} */}
                  {filePath?.length > 0 && (
                    <>
                      <AttachFile fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {videoPath?.length > 0 && (
                    <>
                      {/* &nbsp; */}
                      <OndemandVideoOutlined fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {imagePath?.length > 0 && (
                    <>
                      {/* &nbsp; */}
                      <ImageOutlined fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {task?.pieChartId && (
                    <>
                      {/* &nbsp; */}
                      <PieChartOutlined fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {task.description && (
                    <>
                      {/* &nbsp; */}
                      <DescriptionOutlined fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {task?.user?.length > 1 && (
                    <>
                      {/* &nbsp; */}
                      <PeopleAltOutlined fontSize='small' color='primary' />
                      {/* &nbsp; */}
                    </>
                  )}
                  {task?.commentId && (
                    <>
                      {/* &nbsp; */}
                      <CommentOutlined fontSize='small' color='primary' />
                    </>
                  )}
                  {editable ? (
                    <InputBase
                      onChange={(e) => {
                        e.preventDefault();

                        setTitle(e.target.value);
                      }}
                      multiline
                      fullWidth
                      value={title}
                      style={{ minHeight: '7px' }}
                      onBlur={() => {
                        setEditable(false);

                        const text = title.trim().replace(/\s+/g, ' ');

                        if (text === '') {
                          setTitle(task.name);

                          return;
                        }

                        setTitle(text);

                        dispatch(
                          updateCardByIdPatch(task._id, { name: text }, token),
                        );

                        task.name = text;
                      }}
                    />
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <div>
                        <Typography variant='body2'>
                          {task?.name.split('').length >= 20
                            ? task?.name.slice(0, 21) + '...'
                            : task?.name}
                        </Typography>
                        {/* <Typography variant='body2'>{taskName}</Typography> */}
                      </div>
                      <Box>
                        {tasksCount > 0 && (
                          <>
                            <AssignmentOutlined
                              color='primary'
                              fontSize='small'
                            />
                            &nbsp;
                          </>
                        )}
                        {tasksCount === 0
                          ? null
                          : checkedCount + '/' + tasksCount}
                      </Box>
                      {isCardEditor && (
                        <Box>
                          <IconButton
                            size='small'
                            color='primary'
                            className={classes.edit}
                            onClick={async () => {
                              setOpen(true);

                              const res = await dispatch(
                                getTasksByCardId(task?._id, token),
                              );

                              if (res?.tasks?.length > 0) {
                                setState({
                                  ...state,
                                  checkboxes: res?.tasks,
                                });
                              }
                            }}>
                            <EditOutlined fontSize='small' />
                          </IconButton>
                          <IconButton
                            size='small'
                            color='primary'
                            className={classes.delete}
                            onClick={handleDialogOpen}>
                            <DeleteOutlined fontSize='small' />
                          </IconButton>
                        </Box>
                      )}
                      {currentBoard.type === 'Template' && isCardEditor && (
                        <Box>
                          <IconButton
                            size='small'
                            color='primary'
                            className={classes.delete}
                            onClick={handleDialogOpen}>
                            <DeleteOutlined fontSize='small' />
                          </IconButton>
                        </Box>
                      )}
                    </div>
                  )}
                </Paper>
              )}
            </div>
          )}
        </Draggable>
        <Feature
          componentUpdated={componentUpdated}
          onClose={handleClose}
          column={column}
          onOpen={open}
          isCardEditor={isCardEditor}
          task={task}
          currentBoard={currentBoard}
          updateComponent={updateComponent}
          checks={checkboxes}
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
              Delete card permanently?
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
                onDeleteCard();
              }}
              variant='contained'
              color='primary'
              size='small'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LightTooltip>
  );
}
