import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  IconButton,
  InputBase,
  TextField,
  Avatar,
  Typography,
  Popover,
  Tooltip,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SideMenu from '../SideMenu';
import { useParams } from 'react-router';
import {
  Add,
  VisibilityOutlined,
  VisibilityOffOutlined,
  CreateOutlined,
} from '@material-ui/icons';
import {
  updateBoard,
  updateBoardById,
} from '../../actions/actionCreators/boardActions';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import BoardInvite from './BoardInvite';
import ViewInvited from './ViewInvited';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px #000000',
    padding: theme.spacing(0.7, 0.7, 0.7, 0.7),
    margin: theme.spacing(0.7, 0.7, 0.7, 0.7),
    fontFamily: 'sans-serif',
    cursor: 'pointer',
    fontSize: '20px',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'hsla(0,0%,100%,.24)',
      borderRadius: 4,
    },
  },
  whiteIcon: {
    color: '#ffffff',
  },
  addbutton: {
    color: 'white',
    backgroundColor: (props) =>
      props.type !== 'card' ? 'hsla(0,0%,100%,.24)' : 'inherit',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(9,30,66,.08)',
    },
    borderRadius: '25px',
  },
  manageBudget: {
    color: '#ffffff',
    paddingLeft: '10px',
    cursor: 'pointer',
  },
  budgetTextfield: {
    backgroundColor: '#ffffff !important',
  },
  budgetDiv: {
    display: 'flex',
  },
  infoDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
  cursorPointer: {
    cursor: 'pointer',
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

export default function BoardHeader({ title, componentUpdated }) {
  const classes = useStyles();
  const { currBoard } = useSelector((state) => state.boards);
  const { token, user } = useSelector((state) => state.user);
  const [hoverUser, setHoverUser] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [budgetEditable, setBudgetEditable] = useState(false);
  const [usedEditable, setUsedEditable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const openPopover = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [isBoardEditor, setIsBoardEditor] = useState(false);
  const [invitedUserInfo, setInvitedUserInfo] = useState({});
  const [editable, setEditable] = useState(false);
  const [show, setShow] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    user &&
      currBoard.user &&
      currBoard.user.map((u) => {
        if (u?.userId?._id === user?._id) {
          if (u?.role === 'Editor' || u?.role === 'Admin') {
            setIsBoardEditor(true);
          } else {
            setIsBoardEditor(false);
          }
        }
        return;
      });
  }, [user, currBoard]);

  const toggleShow = (name, event) => {
    setShow(!show);
  };

  const handleCardModalOpen = () => {
    setCardModalOpen(true);
  };

  const handleCardModalClose = () => {
    setCardModalOpen(false);
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const setBackground = (background) => {
    if (background?.thumb) {
      dispatch(
        updateBoardById(
          currBoard._id,
          {
            image: {
              full: background?.full,
              thumb: background?.thumb,
              color: 'black',
            },
          },
          token,
        ),
      );
    } else {
      dispatch(
        updateBoardById(
          currBoard._id,
          {
            image: {
              full: '',
              thumb: '',
              color: background,
            },
          },
          token,
        ),
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.infoDiv}>
        {editable ? (
          <InputBase
            fullWidth
            defaultValue={title}
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
            autoFocus
            onBlur={(e) => {
              const value = e.target.value;

              setEditable(false);

              if (!value || value == title) {
                return;
              }

              dispatch(updateBoardById(id, { name: value }, token));

              componentUpdated();
            }}
          />
        ) : (
          <div className={classes.title} onClick={() => setEditable(true)}>
            <span>{title}</span>&nbsp;
            <CreateOutlined />
          </div>
        )}
        <AvatarGroup max={show ? undefined : 4} style={{ zIndex: 0 }}>
          {currBoard?.user?.map((boardUser, key) => (
            <LightTooltip
              key={key}
              title={
                boardUser?.userId?._id === user?._id
                  ? 'You'
                  : boardUser?.userId?.firstName +
                    ' ' +
                    boardUser?.userId?.lastName
              }>
              <Avatar
                key={key}
                aria-owns={openPopover ? 'mouse-over-popover' : undefined}
                alt={
                  boardUser?.userId?.firstName +
                  ' ' +
                  boardUser?.userId?.lastName
                }
                src={boardUser?.userId?.imagePath}
                className={classes.cursorPointer}
                onClick={() => {
                  setInvitedUserInfo(boardUser);
                  handleCardModalOpen();
                }}
                // src={`/uploads/${user._id}/profile/${boardUser?.userId?.imagePath}`}
              >
                {!boardUser?.userId?.imagePath &&
                  boardUser?.userId?.firstName?.split('')[0]}
              </Avatar>
            </LightTooltip>
          ))}
        </AvatarGroup>
        {show ? (
          <IconButton className={classes.whiteIcon} onClick={toggleShow}>
            <VisibilityOffOutlined fontSize='medium' />
          </IconButton>
        ) : (
          currBoard?.user?.length > 4 &&
          !show && (
            <IconButton className={classes.whiteIcon} onClick={toggleShow}>
              <VisibilityOutlined fontSize='medium' />
            </IconButton>
          )
        )}
        {(user?.companyId || user?.employId) && isBoardEditor && (
          <IconButton
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            onClick={handleModal}>
            <Add fontSize='large' className={classes.addbutton} />
          </IconButton>
        )}
        <BoardInvite
          modalOpen={modalOpen}
          handleModal={handleModal}
          componentUpdated={componentUpdated}
        />
      </div>
      {cardModalOpen && (
        <ViewInvited
          cardModalOpen={cardModalOpen}
          invitedUserInfo={invitedUserInfo}
          handleCardModalClose={handleCardModalClose}
        />
      )}
      {/* <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.popoverContent,
        }}
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Typography style={{ padding: '10px' }}>{hoverUser}</Typography>
      </Popover> */}
      <div className={classes.budgetDiv}>
        {currBoard?.subType === 'Budget Management' &&
          currBoard?.type === 'Template' &&
          (!budgetEditable ? (
            <>
              <Divider orientation='vertical' />
              <Typography
                className={classes.manageBudget}
                variant='h6'
                onClick={() => {
                  setBudgetEditable(true);
                  setUsedEditable(false);
                }}>
                <b>Budget:</b> {currBoard?.budget}
              </Typography>
              <Divider orientation='vertical' />
            </>
          ) : (
            <>
              <TextField
                className={classes.budgetTextfield}
                variant='outlined'
                defaultValue={currBoard?.budget}
                label='Budget'
                type='number'
                onBlur={(e) => {
                  setBudgetEditable(false);
                  setUsedEditable(false);

                  if (!e.target.value) {
                    return;
                  }
                  if (+e.target.value === +currBoard.budget) {
                    return;
                  }
                  if (+e.target.value < +currBoard.used) {
                    return;
                  }

                  dispatch(
                    updateBoard(
                      id,
                      {
                        budget: e.target.value,
                        left: e.target.value - currBoard.used,
                      },
                      token,
                    ),
                  ).then((res) => {
                    componentUpdated();
                  });
                }}
              />
              <Divider orientation='vertical' flexItem />
            </>
          ))}
        {currBoard?.subType === 'Budget Management' &&
          currBoard?.type === 'Template' &&
          (!usedEditable ? (
            <>
              <Divider orientation='vertical' flexItem />
              <Typography
                className={classes.manageBudget}
                variant='h6'
                onClick={() => {
                  setUsedEditable(true);
                  setBudgetEditable(false);
                }}>
                <b>Used:</b> {currBoard?.used}
              </Typography>
            </>
          ) : (
            <TextField
              className={classes.budgetTextfield}
              variant='outlined'
              label='Used'
              type='number'
              defaultValue={currBoard?.used}
              onBlur={(e) => {
                setBudgetEditable(false);
                setUsedEditable(false);

                if (!e.target.value) {
                  return;
                }
                if (+e.target.value === +currBoard.used) {
                  return;
                }
                if (+e.target.value > +currBoard.left) {
                  return;
                }

                dispatch(
                  updateBoard(
                    id,
                    {
                      used: e.target.value,
                      left: +currBoard.left - +e.target.value,
                    },
                    token,
                  ),
                ).then((res) => {
                  componentUpdated();
                });
              }}
            />
          ))}
        {currBoard?.subType === 'Budget Management' &&
          currBoard?.type === 'Template' && (
            <>
              <Divider orientation='vertical' flexItem />
              <Typography className={classes.manageBudget} variant='h6'>
                <b>Left:</b> {currBoard?.left}
              </Typography>
              <Divider orientation='vertical' flexItem />
            </>
          )}
      </div>
      <div style={{ display: 'flex' }}>
        <SideMenu setBackground={setBackground} />
      </div>
    </div>
  );
}
