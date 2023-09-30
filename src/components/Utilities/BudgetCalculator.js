import React, { useEffect, useState } from 'react';
import { Paper, TextField, Typography, Button } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompany,
  updateCompany,
} from '../../actions/actionCreators/companyActions';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';
import Main from '../pieChart/Main';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '50px',
  },
  styledForm: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  styledPapers: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  styledPaper: {
    padding: '10px',
  },
  paperHeading: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function BudgetCalculator() {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.user);
  const { company } = useSelector((state) => state.companies);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    budget: 0,
    expense: 0,
    refresh: false,
  });
  const { refresh, expense, budget } = state;

  const checkOwner = async (e) => {
    if (!user?._id && token) {
      dispatch(fetchUserInfo(token));
    }

    if (!user?.employId && !user?.companyId) {
      history.push(`/${user?.firstName + ' ' + user?.lastName}/home`);
    }
  };

  useEffect(() => {
    if (user?._id && token) {
      checkOwner();
    }
  }, [token, user]);

  const getResponse = () => {
    if (user?.companyId) {
      dispatch(getCompany(user?.companyId, token));
    } else if (user?.employId) {
      dispatch(getCompany(user?.employId, token));
    }

    setState({ ...state, refresh: false });
  };

  useEffect(() => {
    if (token && user) {
      getResponse();
    }
  }, [token, user, refresh]);

  useEffect(() => {}, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (+budget > 0) {
      if (+budget > +company.used) {
        const data = {
          budget,
          left: +budget - +company.used,
        };
        const res = await dispatch(updateCompany(user?.companyId, data, token));

        alert(res.message);

        setState({
          ...state,
          budget: 0,
          refresh: true,
        });
      } else {
        alert('Budget must be greater!');
      }
    } else {
      alert('Budget must be greater than 0!');
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();

    if (+expense > 0) {
      if (+company.left >= +expense) {
        let totalExpense = +expense + +company.expenses;
        const data = {
          left: +company.budget - +totalExpense,
          used: +company.used + +expense,
          expenses: +company.expenses + +expense,
        };
        const res = await dispatch(updateCompany(user?.companyId, data, token));

        alert(res.message);

        setState({
          ...state,
          expense: 0,
          refresh: true,
        });
      } else {
        alert('Your expense is more than your budget left!');
      }
    } else {
      alert('Expense must be greater than 0!');
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.paperHeading}>
          <Paper elevation={3} className={classes.styledPaper}>
            <Typography variant='body1'>
              <b>Budget:</b> {company?.budget}
            </Typography>
            <Typography variant='body1'>
              <b>Budget Used:</b> {company?.used}
            </Typography>
            <Typography variant='body1'>
              <b>Budget Left:</b> {company?.left}
            </Typography>
          </Paper>
          <Main />
        </div>
        <div className={classes.styledPapers}>
          <Paper elevation={3} className={classes.styledPaper}>
            <form onSubmit={onSubmit} className={classes.styledForm}>
              <Typography variant='h4'>Edit Budget:</Typography>
              <div>
                <TextField
                  required
                  variant='outlined'
                  fullWidth
                  label='Budget'
                  type='number'
                  name='budget'
                  value={budget}
                  onChange={onChange}
                />
              </div>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                size='small'>
                Update
              </Button>
            </form>
          </Paper>
          <Paper elevation={3} className={classes.styledPaper}>
            <form onSubmit={onUpdate} className={classes.styledForm}>
              <Typography variant='h4'>Add Expense: </Typography>
              <div>
                <TextField
                  required
                  variant='outlined'
                  fullWidth
                  name='expense'
                  label='Expense'
                  type='number'
                  value={expense}
                  onChange={onChange}
                />
              </div>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                size='small'>
                Update
              </Button>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
}
