import React, { useState } from 'react';
import {
  IconButton,
  Typography,
  Modal,
  makeStyles,
  Avatar,
  Button,
  CardContent,
  TextField,
  CardHeader,
  Card,
  Grid,
} from '@material-ui/core';
import {
  Close,
  Remove,
  Add,
  EmailOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector, useDispatch } from 'react-redux';
import { sendCustomEmail } from '../../actions/actionCreators/emailAction';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '30px',
  },
  buttonRight: {
    float: 'right',
  },
  colorWhite: {
    color: '#ffffff',
  },
}));

export default function ViewInvited({
  invitedUserInfo,
  cardModalOpen,
  handleCardModalClose,
}) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const classes = useStyles();
  const [subject, setSubject] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { user, token } = useSelector((state) => state.user);

  const toggleShowEmail = (e) => {
    setShowEmail(!showEmail);
  };

  const onSend = async () => {
    if (
      !message ||
      !subject ||
      !user ||
      message === '<p><small>Enter email content</small></p>'
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const data = {
      from: user.email,
      subject,
      email: invitedUserInfo?.userId?.email,
      message,
    };
    const res = await sendCustomEmail(data, token);

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    setSubject('');
    setMessage('');
    setDisabled(false);
  };

  return (
    <div>
      <Modal
        keepMounted
        open={cardModalOpen}
        onClose={handleCardModalClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-message'>
        <Card
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <IconButton onClick={handleCardModalClose} style={{ float: 'right' }}>
            <Close fontSize='small' />
          </IconButton>
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: red[500] }}
                src={invitedUserInfo?.userId?.imagePath}>
                {invitedUserInfo?.userId?.firstName?.split('')[0]}
              </Avatar>
            }
            title={
              invitedUserInfo?.userId?.firstName +
              ' ' +
              invitedUserInfo?.userId?.lastName
            }
            subheader={invitedUserInfo?.userId?.email}
          />
          <CardContent>
            <Typography variant='body2' color='textSecondary'>
              <b>Phone Number: </b> {invitedUserInfo?.userId?.phoneNumber}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <b>Role: </b> {invitedUserInfo?.role}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <b>Email: </b> {invitedUserInfo?.userId?.email}
            </Typography>
            {invitedUserInfo?.userId?._id != user?._id && !showEmail && (
              <div style={{ float: 'right' }}>
                <Button
                  variant='contained'
                  onClick={toggleShowEmail}
                  size='small'
                  color='primary'
                  className={classes.colorWhite}
                  startIcon={<VisibilityOutlined />}>
                  Send Email
                </Button>
              </div>
            )}
            {showEmail && (
              <div style={{ float: 'right' }}>
                <Button
                  variant='contained'
                  size='small'
                  color='primary'
                  onClick={toggleShowEmail}
                  className={classes.colorWhite}
                  startIcon={<VisibilityOffOutlined />}>
                  Send Email
                </Button>
              </div>
            )}
            <br />
            {showEmail && (
              <Grid container spacing={3}>
                {/* <form onSubmit={onSend}> */}
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    label='Subject'
                    size='small'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Editor
                    value={message}
                    initialValue={'<small>Enter email content</small>'}
                    onBlur={(e) => {
                      if (message === '') {
                        setMessage('<p><small>Enter email content</small></p>');
                      }
                    }}
                    onFocus={(e) => {
                      if (
                        message === '<p><small>Enter email content</small></p>'
                      ) {
                        setMessage('');
                      }
                    }}
                    init={{
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount',
                      ],
                      toolbar:
                        'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    onEditorChange={(content) => {
                      setMessage(content);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    variant='contained'
                    className={classes.buttonRight}
                    color='primary'
                    size='small'
                    disabled={disabled || !user?.emailVerified}
                    onClick={() => {
                      dispatch(openLoader({ open: true }));
                      onSend();
                    }}
                    // onClick={() => setLoader(true)}
                  >
                    Send
                  </Button>
                </Grid>
                {/* </form> */}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
}
