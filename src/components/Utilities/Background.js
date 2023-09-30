import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Paper,
  Button,
  TextField,
  Typography,
  IconButton,
  InputLabel,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Hr from '../Hr';
import {
  ImageOutlined,
  PaletteOutlined,
  PanoramaOutlined,
} from '@material-ui/icons';
import MenuHeader from '../MenuHeader';
import { fetchBoardById } from '../../actions/actionCreators/boardActions';
import { uploadBoardAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#ffffff',
    width: '321px',
    float: 'right',
    height: '100vh',
    right: theme.spacing(0),
    top: theme.spacing(8),
    borderRadius: theme.spacing(0),
    position: 'fixed',
    padding: theme.spacing(1),
    zIndex: '1200',
  },
  card: {
    height: '90px',
    width: '45%',
    margin: theme.spacing(0.7),
    borderRadius: theme.spacing(1),
    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    },
  },
  menuContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexSpace: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  spacing: {
    margin: '10px',
  },
  paddingTop: {
    paddingTop: '80px',
  },
  btnRight: {
    float: 'right',
  },
  label: {
    cursor: 'pointer',
    border: '2px solid #183569',
    color: '#183569',
    width: 'fit-content',
    padding: '3px',
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
}));

const colors = [
  'rgb(0, 121, 191)',
  'rgb(210, 144, 52)',
  'rgb(81, 152, 57)',
  'rgb(176, 70, 50)',
  'rgb(137, 96, 158)',
  'rgb(205, 90, 145)',
  '#b2102f',
  '#cda311',
  '#009688',
  'rgb(255, 109, 109)',
  'rgb(233, 231, 0)',
];

export default function Background({
  closeHandler,
  setColorBackground,
  backHandler,
}) {
  const classes = useStyles();
  const [showColor, setShowColor] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { token } = useSelector((state) => state.user);
  const { currBoard } = useSelector((state) => state.boards);
  const [state, setState] = useState({
    attachment: null,
    refresh: false,
  });
  const { attachment, refresh } = state;
  const dispatch = useDispatch();

  const getCurrentBoard = async () => {
    await dispatch(fetchBoardById(currBoard._id, token));

    setState({ ...state, refresh: false });
  };

  useEffect(() => {
    if (currBoard?._id && refresh && token) {
      getCurrentBoard();
    }
  }, [refresh, currBoard]);

  const onFileUpload = async (e) => {
    e.preventDefault();

    if (attachment?.type.split('/')[0] !== 'image') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Select an image!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (attachment?.size / 1024 / 1024 > 20) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Too large image!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    if (!attachment) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Choose an image first!',
          severity: false,
        }),
      );
      return dispatch(closeLoader());
    }

    const formData = new FormData();

    formData.append('file', attachment);

    const res = await uploadBoardAttachment(currBoard?._id, formData, token);
    // const res = await axios.post(
    //   `/api/file/uploadboardpicture/${currBoard._id}`,
    //   // `/file/uploadboardpicture/${currBoard._id}?userId=${user._id}`,
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'x-auth-token': token,
    //     },
    //   },
    // );

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    setState({ ...state, refresh: true });
  };

  const onchange = (e) => {
    setState({ ...state, attachment: e.target.files[0] });
  };

  return (
    <>
      <Paper className={classes.container}>
        <MenuHeader
          text='Background'
          closeHandler={closeHandler}
          backHandler={backHandler}
          type='background'
        />
        <Hr />
        <div className={classes.flexSpace}>
          {/* <div
          className={classes.card}
          style={{
            backgroundImage: 'url(' + background + ')',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={() => {
            setShowColor(false)
            setShowImage(true)
          }}
        /> */}
          <IconButton
            onClick={() => {
              setShowColor(false);
              setShowImage(true);
            }}>
            <PanoramaOutlined
              color='primary'
              style={{ fontSize: 'xxx-large' }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              setShowColor(true);
              setShowImage(false);
            }}>
            <PaletteOutlined
              color='primary'
              style={{ fontSize: 'xxx-large' }}
            />
          </IconButton>
          {/* <div
          className={classes.card}
          style={{
            backgroundImage: 'url(' + colorb + ')',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={() => {
            setShowColor(true)
            setShowImage(false)
          }}
        /> */}
        </div>
        {showColor && (
          <div className={classes.menuContainer}>
            {colors.map((color) => (
              <div
                className={classes.card}
                key={color}
                style={{ backgroundColor: color }}
                onClick={setColorBackground.bind(null, color)}
              />
            ))}
          </div>
        )}
        {showImage && (
          <div className={classes.menuContainer}>
            <form
              className={`${classes.spacing} ${classes.flexEnd}`}
              onSubmit={onFileUpload}>
              <InputLabel className={classes.label} htmlFor='file'>
                Choose an Image
                <ImageOutlined />
              </InputLabel>
              <Typography variant='caption'>{attachment?.name}</Typography>
              <TextField
                className={classes.file}
                type='file'
                id='file'
                name='file'
                onChange={onchange}
              />
              <Button
                type='submit'
                variant='contained'
                onClick={() => dispatch(openLoader({ open: true }))}
                color='primary'
                size='small'
                className={classes.btnRight}>
                Upload
              </Button>
            </form>
            {/* {images.map((image) => (
            <div
              className={classes.card}
              key={image.id}
              style={{
                backgroundImage: `url(${image.thumb})`,
                positon: 'relative',
              }}
              onClick={setColorBackground.bind(null, image)}
            >
              <span
                style={{
                  position: 'absolute',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  width: '100px',
                  marginTop: '68px',
                  marginRight: '10px',
                  textDecoration: 'underline',
                  lineHeight: '1.5em',
                  height: '1.5em',
                }}
              >
                <a
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'white',
                  }}
                  href={image.user.link}
                  target="blank"
                >
                  {image.user.name}
                </a>
              </span>
            </div>
          ))} */}
          </div>
        )}
      </Paper>
    </>
  );
}
