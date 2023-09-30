import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CheckCircle, CheckCircleOutline } from '@material-ui/icons';
import { getManyFromTodoList } from '../../actions/actionCreators/todoListActions';

const useStyles = makeStyles((theme) => ({
  styledPaper: {
    padding: '20px',
    borderRadius: '20px',
    maxWidth: '350px',
    minWidth: '300px',
    minHeight: '300px',
    maxHeight: '380px',
    margin: '10px',
  },
  styledListFirst: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    '& ul': { padding: 0 },
  },
  styledListSecond: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  },
}));

export default function TodoListDashboard() {
  const { user, token } = useSelector((state) => state.user);
  const classes = useStyles();
  const { todos } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const getResponse = () => {
    if (user?._id && token) {
      dispatch(getManyFromTodoList(user._id, token));
    }
  };

  useEffect(() => {
    getResponse();
  }, [token, user]);

  return (
    <Paper className={classes.styledPaper}>
      <Typography variant='h5' color='textPrimary' gutterBottom>
        All Todos
      </Typography>
      <List className={classes.styledListFirst} subheader={<li />}>
        <Divider variant='fullWidth' component='li' />
        {todos?.length > 0 ? (
          todos?.map((todo, key) => (
            <List className={classes.styledListSecond}>
              <Link to={`/${user?.firstName + ' ' + user?.lastName}/todos`}>
                <ListItem
                  key={key}
                  button
                  alignItems='flex-start'
                  style={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemText
                    primary={todo?.name}
                    secondary={
                      <>
                        <Typography
                          variant='body2'
                          color='textPrimary'
                          style={{ display: 'inline-flex' }}>
                          <b>Description:</b>&nbsp;
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `${todo?.description}`,
                            }}
                          />
                        </Typography>
                        <Typography variant='body2' color='textPrimary'>
                          <b>Created At:</b>{' '}
                          <span>
                            {new Date(todo?.createdAt).toLocaleString('en-US', {
                              hour12: false,
                            })}
                          </span>
                        </Typography>
                      </>
                    }
                  />
                  {todo?.done ? (
                    <CheckCircle color='primary' fontSize='small' />
                  ) : (
                    <CheckCircleOutline color='primary' fontSize='small' />
                  )}
                </ListItem>
              </Link>
              <Divider variant='fullWidth' component='li' />
            </List>
          ))
        ) : (
          <Typography variant='h6' style={{ textAlign: 'center' }}>
            No todos available
          </Typography>
        )}
      </List>
    </Paper>
  );
}
