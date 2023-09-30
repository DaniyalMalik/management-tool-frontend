import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Box, Typography, Tab, Tabs } from '@material-ui/core';
import TodoListItems from './TodoListItems';
import CreateTodoListItem from './CreateTodoListItem';
import AppBarDrawer from '../headers/AppBarDrawer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // padding: '20px',
    width: '100%',
  },
  appBarBackground: {
    backgroundColor: '#ffffff',
  },
}));

export default function TodoList() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <AppBarDrawer
      component={
        <div className={classes.root}>
          <AppBar position='static' className={classes.appBarBackground}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
              // centered
              aria-label='full width tabs example'>
              <Tab label='Todo List' {...a11yProps(0)} />
              <Tab label='Create a todo list item' {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <TodoListItems />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <CreateTodoListItem handleChangeIndex={handleChangeIndex} />
            </TabPanel>
          </SwipeableViews>
        </div>
      }
    />
  );
}
