import React, { useEffect, useState } from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateCardByIdPut } from '../../actions/actionCreators/cardActions';
import { Editor } from '@tinymce/tinymce-react';
import { openSnackbar } from '../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../actions/actionCreators/loaderActions';

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px',
  },
  buttonRight: {
    float: 'right',
  },
}));

export default function Description({ task, componentUpdated }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const classes = useStyles();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task?.description);
    }
  }, [task]);

  const onDescriptionUpdate = async (e) => {
    e.preventDefault();

    if (
      !description ||
      description === '<p><small>Enter description for card</small></p>'
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

    const data = { description };
    const res = await dispatch(updateCardByIdPut(task._id, data, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());
    componentUpdated();
  };

  return (
    <>
      <form className={classes.spacing} onSubmit={onDescriptionUpdate}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Editor
              value={description}
              initialValue={
                !task?.description &&
                '<small>Enter description for card</small>'
              }
              onBlur={(e) => {
                if (!description && !task?.description) {
                  setDescription(
                    '<p><small>Enter description for card</small></p>',
                  );
                }
              }}
              onFocus={(e) => {
                if (
                  !task?.description &&
                  description ===
                    '<p><small>Enter description for card</small></p>'
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
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Button
              onClick={() => dispatch(openLoader({ open: true }))}
              type='submit'
              size='small'
              variant='contained'
              color='primary'
              className={classes.buttonRight}>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
      <br />
    </>
  );
}
