import React, { useState } from 'react';
import { IconButton, Typography, Divider } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
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
    const res = await removeCardAttachment(task?._id, url, 'file', token);

    // if ((user?.companyId || user?.employId) && res?.success) {
    if (res?.success) {
      const data = {
        type: 'file',
        path: url,
        cardId: task?._id,
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
      {task?.filePath?.length > 0 && (
        <>
          <Typography variant='h4'>Files</Typography>
          <div
            style={{
              overflowY: 'scroll',
              width: '100%',
              height: '200px',
            }}>
            {task?.filePath?.map((item, key) => (
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
                      <AttachFile fontSize='medium' />
                    </Typography>
                  </IconButton>
                </a>
                <IconButton
                  onClick={() => {
                    dispatch(openLoader({ open: true }));
                    onDelete(item);
                  }}>
                  <DeleteOutlined fontSize='medium' color='primary' />
                </IconButton>
              </div>
            ))}
          </div>
          <Divider />
          <br />
        </>
      )}
    </>
  );
}
