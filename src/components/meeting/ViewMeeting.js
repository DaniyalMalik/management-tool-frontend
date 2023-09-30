import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@material-ui/core'
import { VideoCall } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Close, AddIcCall, LocationOn, OpenInNew } from '@material-ui/icons'

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
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

export default function User({ open, meeting, handleModal }) {
  const { token, user } = useSelector((state) => state.user)

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle id="customized-dialog-title" onClose={handleModal}>
        <b>Meeting Information</b>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Topic: </b>
          {meeting?.topic}
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Date and Time: </b>
          {new Date(meeting?.dateAndTime).toLocaleString('en-US', {
            hour12: false,
          })}
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Type: </b>
          {meeting?.type}
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Meeting Agenda: </b>
          {meeting?.meetingAgenda?.replace(/<[^>]+>/g, '')}
        </Typography>
        <br />
        <Typography gutterBottom>
          <b>Participants: </b>
          {meeting?.user?.length > 0 &&
            meeting?.user?.map(
              (u) => u?.userId?.firstName + ' ' + u?.userId?.lastName + ', ',
            )}
        </Typography>
        {meeting?.type === 'Video Call' &&
          meeting?.user?.length > 0 &&
          meeting.user.map(
            (u) =>
              u.userId._id === user._id &&
              u.role === 'Scheduler' && (
                <>
                  <br />
                  <Typography gutterBottom>
                    <b>Link for Host: </b>
                    <a href={meeting?.startUrl} target="_blank">
                      Zoom Host Link <VideoCall color="primary" />
                      <sup>
                        <OpenInNew color="primary" fontSize="small" />
                      </sup>
                    </a>
                  </Typography>
                  <br />
                  <Typography gutterBottom>
                    <b>Link for Participants: </b>
                    <a href={meeting?.joinUrl} target="_blank">
                      Zoom Participants Link <VideoCall color="primary" />
                      <sup>
                        <OpenInNew color="primary" fontSize="small" />
                      </sup>
                    </a>
                  </Typography>
                  <br />
                  <Typography gutterBottom>
                    <b>Meeting Password: </b>
                    {meeting?.meetingPassword}
                  </Typography>
                </>
              ),
          )}
        {meeting?.type === 'Video Call' &&
          meeting?.user?.length > 0 &&
          meeting.user.map(
            (u) =>
              u.userId._id === user._id &&
              u.role === 'Participant' && (
                <>
                  <br />
                  <Typography gutterBottom>
                    <b>Link for Participants: </b>
                    <a href={meeting?.joinUrl} target="_blank">
                      Zoom Participants Link <VideoCall color="primary" />
                      <sup>
                        <OpenInNew color="primary" fontSize="small" />
                      </sup>
                    </a>
                  </Typography>
                  <br />
                  <Typography gutterBottom>
                    <b>Meeting Password: </b>
                    {meeting?.meetingPassword}
                  </Typography>
                </>
              ),
          )}
        {meeting?.type === 'Audio Call' &&
          meeting?.user?.length > 0 &&
          meeting.user.map(
            (u) =>
              u.userId._id === user._id && (
                <>
                  <br />
                  <Typography gutterBottom>
                    <b>Meeting Phone Number: </b>
                    {meeting?.phoneNumber} <AddIcCall color="primary" />
                  </Typography>
                </>
              ),
          )}
        {meeting?.type === 'Face-to-Face' &&
          meeting?.user?.length > 0 &&
          meeting.user.map(
            (u) =>
              u.userId._id === user._id && (
                <>
                  <br />
                  <Typography gutterBottom>
                    <b>Meeting Location: </b>
                    {meeting?.location} <LocationOn color="primary" />
                  </Typography>
                </>
              ),
          )}
        <br />
        <Typography gutterBottom>
          <b>Scheduled At: </b>
          {new Date(meeting?.createdAt).toLocaleString('en-US', {
            hour12: false,
          })}
        </Typography>
      </DialogContent>
      {/* <DialogActions>
        <Button
          autoFocus
          variant="contained"
          size="small"
          onClick={handleModal}
          color="primary"
        >
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  )
}
