import React, { useState, useEffect } from 'react';
import {
  ImageListItem,
  ImageList,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addToArchive } from '../../actions/actionCreators/archiveActions';
import { DeleteOutlined } from '@material-ui/icons';
import { removeCardAttachment } from '../../actions/actionCreators/uploadActions';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

export default function Images({ task, componentUpdated }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  const onDelete = async (url) => {
    const res = await removeCardAttachment(task._id, url, 'image', token);

    if (res?.success) {
      const data = {
        type: 'image',
        cardId: task?._id,
        path: url,
        userId: user?._id,
        companyId: user?.companyId?._id
          ? user.companyId._id
          : user?.employId?._id,
      };
      const res = await dispatch(addToArchive(data, token));

      dispatch(
        openSnackbar({
          open: true,
          message: res?.message,
          severity: res?.success,
        }),
      );
      dispatch(closeLoader());
    }

    componentUpdated();
  };

  return (
    <>
      {task?.imagePath?.length > 0 && (
        <>
          <Typography variant='h4'>Images</Typography>
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
                <IconButton
                  style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: '75%',
                    left: '85%',
                  }}
                  onClick={() => {
                    dispatch(openLoader({ open: true }));
                    onDelete(item);
                  }}>
                  <DeleteOutlined fontSize='large' color='primary' />
                </IconButton>
              </ImageListItem>
            ))}
          </ImageList>
          <Divider />
          <br />
        </>
      )}
    </>
  );
}
