import React, { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { closeSnackbar } from '../../actions/actionCreators/snackbarActions';
import { useDispatch, useSelector } from 'react-redux';

function Snackbar() {
  const { enqueueSnackbar } = useSnackbar();
  const { severity, message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message && (severity || !severity)) {
      enqueueSnackbar(message, { variant: severity ? 'success' : 'error' });
      dispatch(closeSnackbar());
    }
  }, [message, severity]);

  return <div></div>;
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Snackbar />
    </SnackbarProvider>
  );
}
