import React, { useState } from 'react';
import {
  ImageListItem,
  ImageList,
  Typography,
  Divider,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@material-ui/icons';
import { addToArchive } from '../../actions/actionCreators/archiveActions';
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
    const res = await removeCardAttachment(task?._id, url, 'video', token);

    if (res?.success) {
      const data = {
        type: 'video',
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
