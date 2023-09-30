import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import loginPic_1 from '../../assets/login_picture_1.svg';
import loginPic_2 from '../../assets/login_picture_2.svg';
import bizstruc_logo from '../../assets/bizstruc_logo_colored.png';

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
    alignItems: 'flex-start',
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
  item1: {},
  styledLogo: {
    width: '250px',
    [theme.breakpoints.down('xs')]: {
      width: '200px',
    },
  },
  styledHeading: {
    color: '#ffffff',
    width: '550px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  styledCard: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  styledLoginPic_1: {
    width: '500px',
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
  selfAlign: {
    alignSelf: 'flex-end',
  },
}));

export default function CompanyDashboardTemplate({ Card }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.div1}>
        <div className={classes.item1}>
          <img src={bizstruc_logo} alt='logo' className={classes.styledLogo} />
          <Typography variant='h5' className={classes.styledHeading}>
            Explore the art of project management, and grow as a team from
            concept to completion!
          </Typography>
        </div>
        <div className={classes.selfAlign}>
          <img
            className={classes.styledLoginPic_1}
            src={loginPic_1}
            alt='logo'
          />
        </div>
      </div>
      <div className={classes.div2} />
      <div className={classes.div3}>
        <img
          className={classes.styledLoginPic_2}
          src={loginPic_2}
          alt='image'
        />
      </div>
      <div className={classes.styledParentCard}>
        <div className={classes.styledCard}>{Card}</div>
      </div>
    </div>
  );
}
