import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  InputLabel,
  Paper,
  IconButton,
} from '@material-ui/core';
import { addTodoListItem } from '../../actions/actionCreators/todoListActions';
import {
  AttachFile,
  CancelOutlined,
  AddBoxOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import { uploadTodoAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  parentDiv: {
    marginTop: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styledCard: {
    minHeight: 'auto',
    [theme.breakpoints.up('md')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('md')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '50px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0px',
    },
  },
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

export default function CreateTodoListItem({ handleChangeIndex }) {
  const { token, user } = useSelector((state) => state.user);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const [state, setState] = useState({
    name: '',
    attachment: null,
    change: false,
  });
  const { name, attachment, change } = state;
  const [subNames, setSubNames] = useState([]);
  const [showSubForm, setShowSubForm] = useState(false);
  let subName = '';

  const onSubNameChange = (e) => {
    subName = e.target.value;
  };

  const changeState = () => {
    setState({ ...state, change: !change });
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

  const onDelete = (position, e) => {
    let arr = subNames;

    arr.splice(position, 1);

    setSubNames(arr);
    changeState();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

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

    const data = {
      name,
      description,
      companyId: user?.companyId ? user.companyId : user?.employId,
      userId: user?._id,
      subTodos: subNames,
    };

    const response_1 = await dispatch(addTodoListItem(data, token));

    if (response_1?.success) {
      if (attachment) {
        // const url = `/api/file/uploadtodolistattachment/${response_1?.todo?._id}`,
        const formData = new FormData();
        // config = {
        //   headers: {
        //     'content-type': 'multipart/form-data',
        //     'x-auth-token': token,
        //   },
        // };

        formData.append('file', attachment);

        // const response_2 = await axios.post(url, formData, config);

        const response_2 = await uploadTodoAttachment(
          response_1?.todo?._id,
          formData,
          token,
        );
        if (response_2?.success) {
          handleChangeIndex(0);
          dispatch(
            openSnackbar({
              open: true,
              message: response_1?.message,
              severity: response_1?.success,
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
        handleChangeIndex(0);
        dispatch(
          openSnackbar({
            open: true,
            message: response_1?.message,
            severity: response_1?.success,
          }),
        );
        dispatch(closeLoader());
      }
    }
  };

  const onAttachmentUpload = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.parentDiv}>
      <Card className={classes.styledCard}>
        <CardContent>
          <Typography
            variant='h4'
            color='textPrimary'
            gutterBottom
            style={{ textAlign: 'center' }}>
            Create a Todo List Item
          </Typography>
          <form onSubmit={onSubmit}>
            <div>
              <TextField
                label='Todo Name'
                name='name'
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
                  '<small>Enter description for todo list item</small>'
                }
                onBlur={(e) => {
                  if (description === '') {
                    setDescription(
                      '<p><small>Enter description for todo list item</small></p>',
                    );
                  }
                }}
                onFocus={(e) => {
                  if (
                    description ===
                    '<p><small>Enter description for todo list item</small></p>'
                  ) {
                    setDescription('');
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
                  setDescription(content);
                }}
              />
            </div>
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
            <Typography color='textPrimary' variant='h6'>
              Upload Image/File/GIF
            </Typography>
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
            <br />
            <Button
              type='submit'
              autoFocus
              variant='contained'
              style={{ float: 'right' }}
              onClick={() => dispatch(openLoader({ open: true }))}
              color='primary'
              size='small'>
              Create
            </Button>
            <br />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
