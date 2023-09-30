import React, { useRef, useState, useEffect } from 'react';
import {
  makeStyles,
  IconButton,
  Typography,
  InputBase,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  Box,
  Chip,
} from '@material-ui/core';
import {
  Close,
  DeleteOutlined,
  AssignmentOutlined,
  PersonAddOutlined,
  CommentOutlined,
  MailOutline,
  Attachment,
  CreateOutlined,
  PieChartOutlined,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCardByIdPatch } from '../../actions/actionCreators/cardActions';
import { fetchBoardById } from '../../actions/actionCreators/boardActions';
import Description from './Description';
import AddMember from './member/AddMember';
import Email from './Email';
import Upload from './Upload';
import Task from '../task/Task';
import Comment from './Comment';
import { useParams } from 'react-router-dom';
import RemoveMember from './member/RemoveMember';
import { Pie } from '../addons/charts/Pie';
// import SpeechRecognitionExample from './addons/speech/useSpeechRecognition'
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

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
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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

export default function Feature({
  task,
  users,
  onOpen,
  currentBoard,
  onClose,
  updateComponent,
  componentUpdated,
  isCardEditor,
  column,
}) {
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [taskDisabled, setTaskDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const descriptionElementRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [email, setEmail] = useState(false);
  const [member, setMember] = useState(false);
  const [removeMember, setRemoveMember] = useState(false);
  const [upload, setUpload] = useState(false);
  const [comment, setComment] = useState(false);
  const [pieChart, setPieChart] = useState(false);
  const { currBoard } = useSelector((state) => state.boards);
  // const [speechRecognition, setSpeechRecognition] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getBoard = async (e) => {
    if (token && id && refresh) {
      dispatch(fetchBoardById(id, token));

      await setRefresh(false);
    }
  };

  useEffect(() => {
    getBoard();
  }, [token]);

  useEffect(() => {
    if (currBoard._id && user._id) {
      currBoard.user.map((u) => {
        user._id === u.userId._id &&
          (u.role === 'Admin' || u.role === 'Editor') &&
          setIsAdmin(true);
      });
    }
  }, [currBoard, user]);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;

      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (onOpen) {
      setOpen(onOpen);
      setRefresh(false);
    } else {
      setRefresh(false);
    }
  }, [onOpen, refresh]);

  const handleClose = () => {
    setTaskDisabled(false);
    setOpen(false);
    // setSpeechRecognition(false)
    setPieChart(false);
    setComment(false);
    setUpload(false);
    setRemoveMember(false);
    setMember(false);
    setEmail(false);
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        maxHeight={'md'}
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <DialogTitle id='scroll-dialog-title'>
          {isCardEditor && editable ? (
            <InputBase
              multiline
              fullWidth
              maxlength={2}
              name='editable'
              defaultValue={task?.name}
              style={{ minHeight: '7px' }}
              autoFocus
              onBlur={(e) => {
                setEditable(false);

                if (!e.target.value) {
                  return;
                }

                dispatch(
                  updateCardByIdPatch(
                    task._id,
                    { name: e.target.value },
                    token,
                  ),
                );
              }}
            />
          ) : (
            <>
              <IconButton
                size='small'
                className={classes.close}
                onClick={handleClose}>
                <Close fontSize='small' />
              </IconButton>
              <div
                className={classes.alignCenter}
                onClick={() => isCardEditor && setEditable(true)}>
                <Typography variant='h6'>{task?.name}</Typography>
                &nbsp;
                <CreateOutlined fontSize='small' />
              </div>
            </>
          )}
        </DialogTitle>
        <DialogContent dividers='paper' style={{ overflow: 'initial' }}>
          <DialogContentText
            id='scroll-dialog-description'
            ref={descriptionElementRef}
            tabIndex={-1}>
            <Box className={`${classes.root} ${classes.scrollButtonBar}`}>
              {(user?.companyId || user?.employId) && (
                <Chip
                  variant='outlined'
                  size='large'
                  disabled={taskDisabled}
                  label='Task List'
                  color='primary'
                  onClick={() => setTaskDisabled(true)}
                  icon={<AssignmentOutlined />}
                />
              )}
              {(user?.companyId || user?.employId) && isAdmin && (
                <Chip
                  variant='outlined'
                  label='Add Member'
                  color='primary'
                  disabled={member}
                  onClick={() => setMember(true)}
                  icon={<PersonAddOutlined />}
                />
              )}
              {(user?.companyId || user?.employId) && isAdmin && (
                <Chip
                  variant='outlined'
                  label='Remove Member'
                  color='primary'
                  disabled={removeMember}
                  onClick={() => setRemoveMember(true)}
                  icon={<PersonAddOutlined />}
                />
              )}
              <Chip
                variant='outlined'
                label='Comments'
                disabled={comment}
                color='primary'
                onClick={() => setComment(true)}
                icon={<CommentOutlined />}
              />
              {(user?.companyId || user?.employId) && isAdmin && (
                <Chip
                  variant='outlined'
                  label=' Invite'
                  disabled={email}
                  color='primary'
                  onClick={() => setEmail(true)}
                  icon={<MailOutline />}
                />
              )}
              <Chip
                variant='outlined'
                disabled={upload}
                label=' Upload'
                color='primary'
                onClick={() => setUpload(true)}
                icon={<Attachment />}
              />
              {/* {currBoard.type === 'Custom' && (
              <Chip
                variant="outlined"
                label="    Speech"
                color="primary"
                disabled={speechRecognition}
                onClick={() => setSpeechRecognition(true)}
                icon={<MicNone />}
              />
            )} */}
              {currBoard.type === 'Custom' && (
                <Chip
                  variant='outlined'
                  label='  Pie Chart'
                  color='primary'
                  disabled={pieChart}
                  onClick={() => setPieChart(true)}
                  icon={<PieChartOutlined />}
                />
              )}
            </Box>
            <Divider />
            <Description componentUpdated={componentUpdated} task={task} />
            <Divider />
            {taskDisabled && (
              <>
                <Task
                  task={task}
                  currentBoard={currentBoard}
                  updateComponent={updateComponent}
                />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => setTaskDisabled(false)}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            {comment && (
              <>
                <Comment card={task} componentUpdated={componentUpdated} />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => setComment(false)}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            {pieChart && (
              <>
                <Pie card={task} componentUpdated={componentUpdated} />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => setPieChart(false)}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            {member && (
              <>
                <AddMember
                  column={column}
                  task={task}
                  users={users}
                  componentUpdated={componentUpdated}
                />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => {
                    setMember(false);
                  }}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            {removeMember && (
              <>
                <RemoveMember
                  column={column}
                  task={task}
                  componentUpdated={componentUpdated}
                />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => {
                    setRemoveMember(false);
                  }}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            <Divider />
            {email && (
              <>
                <Email />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => {
                    setEmail(false);
                  }}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            <Divider />
            {upload && (
              <>
                <Upload
                  board={currentBoard}
                  componentUpdated={componentUpdated}
                  task={task}
                />
                <IconButton
                  color='primary'
                  aria-label='delete'
                  onClick={() => {
                    setUpload(false);
                  }}>
                  <DeleteOutlined />
                </IconButton>
              </>
            )}
            <Divider />
            {/* {speechRecognition && (
            <>
              <SpeechRecognitionExample />
              <IconButton
                color="primary"
                aria-label="delete"
                onClick={() => {
                  setSpeechRecognition(false)
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </>
          )} */}
            <Divider />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
