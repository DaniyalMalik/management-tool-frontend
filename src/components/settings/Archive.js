import React, { useState, useEffect } from 'react';
import {
  ImageList,
  makeStyles,
  Typography,
  List,
  Divider,
  ListItem,
  ImageListItemBar,
  ListItemIcon,
  ListItemText,
  ImageListItem,
  IconButton,
} from '@material-ui/core';
import { DeleteOutlined, GetAppOutlined } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  getManyFromArchive,
  deleteFromArchive,
} from '../../actions/actionCreators/archiveActions';
import { deleteArchivedAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  display: {
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  whiteColor: {
    color: '#ffffff',
  },
}));

export default function Archive() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const { archives } = useSelector((state) => state.archives);

  useEffect(() => {
    if (user?._id && token) {
      dispatch(
        getManyFromArchive(
          user?.companyId?._id ? user.companyId._id : user?.employId?._id,
          token,
        ),
      );
    }
  }, [token, user]);

  const onDelete = async (id, cardId, url) => {
    const res = await dispatch(deleteFromArchive(id, token));

    if (res?.success) {
      deleteArchivedAttachment(url, cardId, token);
    }

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
  };

  return (
    <>
      {archives?.length > 0 ? (
        <>
          <Typography variant='h4'>Images</Typography>
          <br />
          <ImageList
            style={{ width: '100%', height: '300px' }}
            cols={3}
            rowHeight={164}>
            {/* <ImageListItem key="Subheader" cols={3}>
              <ListSubheader component="div">Images</ListSubheader>
            </ImageListItem> */}
            {archives.map(
              (archive, key) =>
                archive?.type === 'image' && (
                  <ImageListItem key={key}>
                    <img
                      src={`${archive?.path}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${archive?.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt='image'
                      loading='lazy'
                    />
                    <ImageListItemBar
                      title={
                        <Typography variant='body1' color='textPrimary'>
                          <b>Deleted By:</b>{' '}
                          {archive?.userId?.firstName +
                            ' ' +
                            archive?.userId?.lastName}
                        </Typography>
                      }
                      subtitle={
                        <Typography variant='string' color='textPrimary'>
                          <b>Deleted At:</b>{' '}
                          {new Date(archive?.createdAt).toLocaleString()}
                        </Typography>
                      }
                      actionIcon={
                        <IconButton
                          // style={{
                          //   position: 'absolute',
                          //   zIndex: 1000,
                          //   top: '70%',
                          //   left: '85%',
                          // }}
                          // className={classes.whiteColor}
                          color='primary'
                          onClick={() => {
                            dispatch(openLoader({ open: true }));
                            onDelete(
                              archive?._id,
                              archive?.cardId,
                              archive?.path,
                            );
                          }}>
                          <DeleteOutlined />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ),
            )}
          </ImageList>
          <Divider />
          <br />
          <Typography variant='h4'>Videos</Typography>
          <br />
          <ImageList
            style={{ width: '100%', height: '300px' }}
            cols={3}
            rowHeight={164}>
            {/* <ImageListItem key="Subheader" cols={3}>
              <ListSubheader component="div">Images</ListSubheader>
            </ImageListItem> */}
            {archives.map(
              (archive, key) =>
                archive?.type === 'video' && (
                  <ImageListItem key={key}>
                    <video width='100%' height='auto' controls>
                      <source
                        src={`${archive?.path}?w=164&h=100164&fit=crop&auto=format`}
                        srcSet={`${archive?.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        loading='lazy'
                      />
                    </video>
                    <ImageListItemBar
                      title={
                        <Typography variant='body1' color='textPrimary'>
                          <b>Deleted By:</b>{' '}
                          {archive?.userId?.firstName +
                            ' ' +
                            archive?.userId?.lastName}
                        </Typography>
                      }
                      subtitle={
                        <Typography variant='string' color='textPrimary'>
                          <b>Deleted At:</b>{' '}
                          {new Date(archive?.createdAt).toLocaleString()}
                        </Typography>
                      }
                      actionIcon={
                        <IconButton
                          // style={{
                          //   position: 'absolute',
                          //   zIndex: 1000,
                          //   top: '70%',
                          //   left: '85%',
                          // }}
                          // className={classes.whiteColor}
                          color='primary'
                          onClick={() => {
                            dispatch(openLoader({ open: true }));
                            onDelete(
                              archive?._id,
                              archive?.cardId,
                              archive?.path,
                            );
                          }}>
                          <DeleteOutlined />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ),
            )}
          </ImageList>
          <Divider />
          <br />
          <Typography variant='h4'>Files</Typography>
          <div
            style={{
              overflowY: 'scroll',
              width: '100%',
              height: '200px',
            }}>
            {archives.map(
              (archive, key) =>
                archive?.type === 'file' && (
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: 'background.paper',
                    }}>
                    <ListItem alignItems='flex-start'>
                      {/* <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar> */}
                      <ListItemText
                        primary={`File-${key}`}
                        secondary={
                          <>
                            <Typography
                              // component="span"
                              variant='body2'
                              color='textPrimary'>
                              <b>Deleted By: </b>
                              {archive?.userId?.firstName +
                                ' ' +
                                archive?.userId?.lastName}
                            </Typography>
                            <Typography
                              // component="span"
                              variant='body2'
                              color='textPrimary'>
                              <b>Deleted At: </b>
                              {new Date(archive?.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemIcon>
                        <a
                          href={archive?.path}
                          download='assighment'
                          target='_blank'>
                          <IconButton>
                            <GetAppOutlined />
                          </IconButton>
                        </a>
                        <IconButton
                          // style={{
                          //   position: 'absolute',
                          //   zIndex: 1000,
                          //   top: '70%',
                          //   left: '85%',
                          // }}
                          // className={classes.whiteColor}
                          color='primary'
                          onClick={() => {
                            dispatch(openLoader({ open: true }));
                            onDelete(
                              archive?._id,
                              archive?.cardId,
                              archive?.path,
                            );
                          }}>
                          <DeleteOutlined />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                    <Divider variant='inset' component='li' />
                  </List>
                  // <>
                  //   <div
                  //     style={{
                  //       display: 'flex',
                  //       justifyContent: 'flex-start',
                  //       alignItems: 'center',
                  //     }}
                  //   >
                  //     <Typography variant="h6">File-{key + 1}</Typography>
                  //     <a
                  //       href={archive?.path}
                  //       download="assighment"
                  //       target="_blank"
                  //     >
                  //       <IconButton>
                  //         <Typography variant="body2">
                  //           Download Attachment
                  //           <AttachFile fontSize="medium" />
                  //         </Typography>
                  //       </IconButton>
                  //     </a>
                  //     <IconButton onClick={() => onDelete(archive._id, archive.path)}>
                  //       <DeleteOutlined fontSize="large" color="primary" />
                  //     </IconButton>
                  //   </div>
                  //   <Typography variant="body2">
                  //     {archive?.userId?.firstName +
                  //       ' ' +
                  //       archive?.userId?.lastName}
                  //   </Typography>
                  // </>
                ),
            )}
            <Divider />
            <br />
          </div>
        </>
      ) : (
        <Typography variant='h4' style={{ textAlign: 'center' }}>
          Archive Folder is empty!
        </Typography>
      )}
    </>
  );
}
