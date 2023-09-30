import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  InputLabel,
  Paper,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { updateTodoList } from '../../actions/actionCreators/todoListActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Editor } from '@tinymce/tinymce-react';
import {
  Close,
  AttachFile,
  CancelOutlined,
  AddBoxOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@material-ui/icons';
import { uploadTodoAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

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
  label: {
    cursor: 'pointer',
    border: '2px solid #183569',
    color: '#183569',
    width: 'fit-content',
    padding: '5px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#183569',
      color: '#ffffff',
    },
  },
  file: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
  floatRight: {
    float: 'right',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  allCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default function EditUser({ open, todo, handleModal }) {
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
    description: '',
    attachment: null,
    change: false,
  });
  const { name, description, attachment, change } = state;
  const [subNames, setSubNames] = useState([]);
  const [showSubForm, setShowSubForm] = useState(false);
  let subName = '';

  const onSubNameChange = (e) => {
    subName = e.target.value;
  };

  const onSubNameSubmit = () => {
    if (subName) {
      setSubNames((prev) => prev.concat({ name: subName }));
      setShowSubForm(false);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Enter all fields!',
          severity: false,
        }),
      );
    }
  };

  const changeState = () => {
    setState({ ...state, change: !change });
  };

  const subForm = (
    <>
      <div className={classes.allCenter}>
        <TextField
          label='Sub Todo Name'
          onChange={onSubNameChange}
          name='subTodoName'
          size='small'
          variant='outlined'
          fullWidth
        />
        <IconButton onClick={onSubNameSubmit}>
          <AddBoxOutlined color='primary' />
        </IconButton>
      </div>
      <br />
    </>
  );

  useEffect(() => {
    if (todo) {
      setState({
        ...state,
        name: todo?.name,
        // completed: todo?.done ? 'true' : 'false',
        description: todo?.description,
      });

      if (todo?.subTodos?.length > 0) {
        let arr = [];

        todo.subTodos.map((item) => arr.push(item));

        setSubNames(arr);
      } else {
        setSubNames([]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo]);

  const onDelete = (position, e) => {
    let arr = subNames;

    arr.splice(position, 1);

    setSubNames(arr);
    changeState();
  };

  const onUpdate = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      description ===
        '<p><small>Enter description for todo list item</small></p>'
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

    if (
      attachment?.type.split('/')[0] !== 'video' &&
      attachment?.type.split('/')[0] !== 'image' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large File!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'image' &&
      attachment?.size / 1024 / 1024 > 20
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Image/GIF!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (
      attachment?.type.split('/')[0] === 'video' &&
      attachment?.size / 1024 / 1024 > 100
    ) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large Video!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment) {
      // const url = `/api/file/uploadtodolistattachment/${todo?._id}`,
      const formData = new FormData();
      // config = {
      //   headers: {
      //     'content-type': 'multipart/form-data',
      //     'x-auth-token': token,
      //   },
      // };

      formData.append('file', attachment);

      // const response_2 = await axios.post(url, formData, config);
      const response_2 = await uploadTodoAttachment(todo?._id, formData, token);

      if (response_2?.success) {
        const data = {
          name,
          description,
          done: todo.subTodos.length === subNames.length ? todo.done : false,
          subTodos: subNames,
        };
        const res = await dispatch(updateTodoList(todo._id, data, token));

        handleModal();
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            severity: res?.success,
          }),
        );
        dispatch(closeLoader());
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: response_2?.message,
            severity: response_2?.success,
          }),
        );
        dispatch(closeLoader());
      }
    } else {
      const data = {
        name,
        description,
        done: todo.subTodos.length === subNames.length ? todo.done : false,
        subTodos: subNames,
      };
      const res = await dispatch(updateTodoList(todo._id, data, token));

      handleModal();
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

  const onAttachmentUpload = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth>
      <DialogTitle id='customized-dialog-title' onClose={handleModal}>
        Edit Todo List Item Information
      </DialogTitle>
      <form onSubmit={onUpdate}>
        <DialogContent>
          <div>
            <TextField
              label='Name'
              name='name'
              required
              value={name}
              onChange={onChange}
              variant='outlined'
              fullWidth
            />
          </div>
          <br />
          <div>
            <Editor
              value={description}
              initialValue={
                !todo?.description &&
                '<small>Enter description for todo list item</small>'
              }
              onBlur={(e) => {
                if (!description && !todo?.description) {
                  setState({
                    ...state,
                    description:
                      '<p><small>Enter description for todo list item</small></p>',
                  });
                }
              }}
              onFocus={(e) => {
                if (
                  !todo?.description &&
                  description ===
                    '<p><small>Enter description for todo list item</small></p>'
                ) {
                  setState({ ...state, description: '' });
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
                setState({ ...state, description: content });
              }}
            />
          </div>
          <br />
          {/* <FormControl component='fieldset'>
            <FormLabel component='legend'>Completed</FormLabel>
            <RadioGroup
              row
              aria-label='completed'
              name='completed'
              value={completed}
              onChange={onChange}>
              <FormControlLabel
                value='true'
                control={<Radio color='primary' />}
                label='Yes'
              />
              <FormControlLabel
                value='false'
                control={<Radio color='primary' />}
                label='No'
              />
            </RadioGroup>
          </FormControl> */}
          <br />
          {subNames.map((item, key) => (
            <Paper className={classes.styledPaper} elevation={3}>
              <div className={classes.alignCenter}>
                <Typography variant='body1'>
                  <b>Sub Todo-{key + 1}:</b>
                </Typography>
                &nbsp;
                <Typography variant='body1'>{item?.name}</Typography>
              </div>
              <IconButton onClick={(e) => onDelete(key, e)}>
                <CancelOutlined color='primary' />
              </IconButton>
            </Paper>
          ))}
          <br />
          {showSubForm && subForm}
          <div>
            {showSubForm && (
              <Button
                variant='contained'
                className={classes.floatRight}
                color='primary'
                size='small'
                startIcon={<VisibilityOffOutlined />}
                onClick={() => setShowSubForm(false)}>
                Add sub todo item
              </Button>
            )}
            {!showSubForm && (
              <Button
                variant='contained'
                className={classes.floatRight}
                onClick={() => setShowSubForm(true)}
                color='primary'
                size='small'
                startIcon={<VisibilityOutlined />}>
                Add sub todo item
              </Button>
            )}
          </div>
          <br />
          <Typography variant='h6'>Upload Image/File/GIF</Typography>
          <InputLabel className={classes.label} htmlFor='file'>
            Choose File
            <AttachFile />
          </InputLabel>
          <Typography variant='caption'>{attachment?.name}</Typography>
          <TextField
            className={classes.file}
            type='file'
            id='file'
            name='file'
            onChange={onAttachmentUpload}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type='submit'
            autoFocus
            size='small'
            onClick={() => dispatch(openLoader({ open: true }))}
            variant='contained'
            className={classes.floatRight}
            color='primary'>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
