import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import lgif from '../../assets/lgif.gif';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1500,
  },
}));

export default function Loader() {
  const classes = useStyles();
  const { openLoader } = useSelector((state) => state.loader);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={openLoader}>
        <img src={lgif} width='100px' height='100px' />
        {/* <CircularProgress color='primary' /> */}
      </Backdrop>
    </div>
  );
}
