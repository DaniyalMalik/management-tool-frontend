import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import bizstruc_logo from '../../assets/bizstruc_logo_colored.png';
import { useHistory } from 'react-router-dom';
import notfound_icon from '../../assets/notfound.png';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
  },
  div1: {
    height: '40vh',
    width: '100vw',
    background: 'linear-gradient(90deg, #163467, #3c5f9d)',
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('lg')]: {
      paddingLeft: '50px',
      paddingRight: '50px',
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: '50px',
      paddingRight: '0px',
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '50px',
      paddingRight: '0px',
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '20px',
      paddingRight: '0px',
      justifyContent: 'space-between',
    },
  },
  div2: {
    height: '2vh',
    background: 'linear-gradient(90deg, #fda62d, #fdc24e)',
    width: '100vw',
    borderRadius: '0px 0px 3px 3px',
  },
  div3: {
    height: '58vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.only('sm')]: {
      alignItems: 'flex-end',
    },
  },
  styledLogo: {
    width: '250px',
    alignSelf: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      width: '200px',
    },
  },
  styledHeading: {
    color: '#ffffff',
    alignSelf: 'flex-end',
    // width: '550px',
  },
  styledCard: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  styledLoginPic_1: {
    width: '500px',
    alignSelf: 'flex-end',

    [theme.breakpoints.only('xl')]: {
      width: '500px',
    },
    [theme.breakpoints.only('lg')]: {
      width: '350px',
    },
    [theme.breakpoints.only('md')]: {
      width: '250px',
      paddingBottom: '80px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  styledLoginPic_2: {
    paddingLeft: '100px',
    width: '600px',
    [theme.breakpoints.only('xl')]: {
      paddingLeft: '100px',
      width: '600px',
    },
    [theme.breakpoints.only('lg')]: {
      paddingLeft: '50px',
      width: '425px',
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: '0px',
      width: '270px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  styledParentCard: {
    display: 'table',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  displayCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  notFoundIcon: {
    width: '100px',
    height: '100px',
  },
}));

export default function NotFound() {
  const { user } = useSelector((state) => state.user);
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div className={classes.div1}>
        <img src={bizstruc_logo} alt='logo' className={classes.styledLogo} />
        <div className={classes.displayFlex}>
          <img
            src={notfound_icon}
            alt='logo'
            className={classes.notFoundIcon}
          />
          <Typography
            variant='h1'
            component='h1'
            className={classes.styledHeading}>
            Page Not Found!
          </Typography>
        </div>
      </div>
      <div className={classes.div2} />
      <div className={classes.styledParentCard}>
        <div className={classes.styledCard}>
          <div className={classes.displayCenter}>
            <Button
              variant='contained'
              color='primary'
              onClick={() =>
                history.push(
                  '/' + user?.firstName + ' ' + user?.lastName + '/home',
                )
              }
              size='large'>
              Go Home
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              variant='outlined'
              color='primary'
              onClick={() => history.push('/')}
              size='large'>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
