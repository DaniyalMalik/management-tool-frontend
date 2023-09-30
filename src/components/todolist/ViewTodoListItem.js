import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  ImageListItem,
  Paper,
  Divider,
  ImageList,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  Close,
  AttachFile,
  CheckCircleOutline,
  CancelOutlined,
  CheckCircle,
} from '@material-ui/icons';

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
}));

export default function ViewTodoListItem({ open, todo, handleModal }) {
  const { token, user } = useSelector((state) => state.user);
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        <b>Todo List Item Information</b>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Name: </b>
          {todo?.name}
        </Typography>
        <br />
        <Typography gutterBottom>
          <div>
            <b>Description: </b>
            <div
              dangerouslySetInnerHTML={{
                __html: `${todo?.description}`,
              }}
            />
          </div>
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Completed: </b>
          {todo?.done ? 'Yes' : 'No'}
        </Typography>
        <br />
        {todo?.subTodos?.length > 0 && (
          <>
            <Typography variant='h6' gutterBottom>
              <b>Sub todos:</b>
            </Typography>
            {todo.subTodos.map((item, key) => (
              <Paper className={classes.styledPaper} elevation={3}>
                <div className={classes.alignCenter}>
                  <Typography variant='body1'>
                    <b>Sub Todo-{key + 1}:</b>
                  </Typography>
                  &nbsp;
                  <Typography variant='body1'>{item?.name}</Typography>
                </div>
                {item?.done ? (
                  <CheckCircle color='primary' />
                ) : (
                  <CheckCircleOutline color='primary' />
                )}
              </Paper>
            ))}
            <br />
          </>
        )}
        <Typography gutterBottom>
          <b>Created At: </b>
          {new Date(todo?.createdAt).toLocaleString('en-US', {
            hour12: false,
          })}
        </Typography>
        {todo?.imagePath?.length > 0 && (
          <>
            <Typography gutterBottom>
              <b>Photos: </b>
            </Typography>
            <br />
            <ImageList
              style={{ width: '100%', height: '200px' }}
              cols={3}
              rowHeight={164}>
              {todo?.imagePath?.map((item, key) => (
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
        {todo?.filePath?.length > 0 && (
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
              {todo?.filePath?.map((item, key) => (
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
      </DialogContent>
    </Dialog>
  );
}
