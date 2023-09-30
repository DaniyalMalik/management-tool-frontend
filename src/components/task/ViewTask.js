import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  Avatar,
  ImageListItem,
  ImageList,
  DialogActions as MuiDialogActions,
  Divider,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Close, AttachFile, Check, Clear } from '@material-ui/icons';
import Submissions from './Submissions';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function ViewTask({ open, task, handleModal }) {
  const { token, user } = useSelector((state) => state.user);
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        <b>Task Information</b>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Name: </b>
          {task?.name}
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Description:</b>&nbsp;
          <div
            dangerouslySetInnerHTML={{
              __html: `${task?.description}`,
            }}
          />
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Deadline: </b>
          <span
            style={{
              color:
                new Date().getTime() > new Date(task.deadline).getTime()
                  ? '#ca0000'
                  : '#51b300',
            }}>
            {new Date(task?.deadline).toLocaleString('en-US', {
              hour12: false,
            })}
          </span>
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Assignees: </b>
          <AvatarGroup>
            {task?.user?.map(
              (taskUser, key) =>
                taskUser.role === 'Viewer' && (
                  <>
                    <div className={classes.alignCenter}>
                      <Avatar key={key} src={taskUser?.userId?.imagePath}>
                        {!taskUser?.userId?.imagePath &&
                          taskUser?.userId?.firstName?.split('')[0]}
                      </Avatar>
                      &nbsp;
                      {taskUser?.userId?.firstName +
                        ' ' +
                        taskUser?.userId?.lastName +
                        ', '}
                      &nbsp;
                    </div>
                  </>
                ),
            )}
          </AvatarGroup>
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Created At: </b>
          {new Date(task?.createdAt).toLocaleString('en-US', {
            hour12: false,
          })}
        </Typography>
        <br />
        {task?.imagePath?.length > 0 && (
          <>
            <Typography gutterBottom>
              <b>Photos: </b>
            </Typography>
            <br />
            <ImageList
              style={{ width: '100%', height: '200px' }}
              cols={3}
              rowHeight={164}>
              {task?.imagePath?.map((item, key) => (
                <ImageListItem key={key}>
                  <img
                    src={`${item}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt='image'
                    loading='lazy'
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        )}
        <br />
        {task?.filePath?.length > 0 && (
          <>
            <Typography gutterBottom>
              <b>Files: </b>
            </Typography>
            <div
              style={{
                overflowY: 'scroll',
                width: '100%',
                height: '200px',
              }}>
              {task?.filePath?.map((item, key) => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Typography variant='h6'>File-{key + 1}</Typography>
                  <a
                    href={item}
                    rel='noopener noreferrer'
                    download='assighment'
                    target='_blank'>
                    <IconButton>
                      <Typography variant='body2'>
                        Download Attachment
                        <AttachFile />
                      </Typography>
                    </IconButton>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
        <br />
        {task?.videoPath?.length > 0 && (
          <>
            <Typography variant='h4'>Videos</Typography>
            <br />
            <ImageList
              style={{ width: '100%', height: '200px' }}
              cols={3}
              rowHeight={164}>
              {task?.videoPath?.map((item, key) => (
                <ImageListItem key={key}>
                  <video controls>
                    <source
                      src={`${item}?w=200&h=200&fit=crop&auto=format`}
                      srcSet={`${item}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                      loading='lazy'
                    />
                  </video>
                </ImageListItem>
              ))}
            </ImageList>
            <Divider />
            <br />
          </>
        )}
        <Divider />
        {task?.user?.length > 0 &&
          task.user.map(
            (u) =>
              u.userId._id === user._id &&
              u.role === 'Editor' && <Submissions task={task} />,
          )}
      </DialogContent>
      {/* <DialogActions>
        <Button
          autoFocus
          variant='contained'
          size='small'
          onClick={handleModal}
          color='primary'>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
