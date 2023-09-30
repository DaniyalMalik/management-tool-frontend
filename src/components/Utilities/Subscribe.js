import React, { useEffect, useState } from 'react'
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../actions/actionCreators/userActions'

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
}))

export default function Subscribe({ open, handleSubscribe, handleSnackbar }) {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.user)
  const classes = useStyles()
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user?._id) {
      setEmail(user.email)
    }
  }, [user])

  const onSubscribe = async (e) => {
    const res = await dispatch(
      updateUser(user?._id, { subscribed: true }, token),
    )

    if (res?.success) {
      handleSnackbar(res?.success, 'Subscribed!')
    } else {
      handleSnackbar(res?.success, 'Could not subscribe!')
    }

    handleSubscribe()
  }

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <Dialog open={open} onClose={handleSubscribe}>
      <DialogTitle>
        Subscribe to receive occational updates from us
        <IconButton
          size="small"
          className={classes.close}
          onClick={handleSubscribe}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={onChange}
          type="email"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          onClick={handleSubscribe}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubscribe}
          size="small"
          variant="contained"
          color="primary"
        >
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  )
}
