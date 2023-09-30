import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Typography, Tab, Tabs, Container } from '@material-ui/core';
import AppBarDrawer from '../headers/AppBarDrawer';
import UpdateInfo from '../user/UpdateInfo';
import UpdateSubscribe from '../user/UpdateSubscribe';
import UpdatePassword from '../auth/UpdatePassword';
import VerifyEmail from '../auth/VerifyEmail';
import SendVerifyLink from '../auth/SendVerifyLink';
import CreateCompany from '../company/CreateCompany';
import { fetchUserInfo } from '../../actions/actionCreators/userActions';

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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    padding: '20px',
  },
  table: {
    width: '100%',
  },
  tab: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  displayCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBarDrawer
      component={
        <Container className={classes.root}>
          <Tabs
            orientation='vertical'
            fullWidth
            value={value}
            onChange={handleChange}
            aria-label='Vertical tabs example'
            className={classes.tabs}>
            <Tab label='Update your Information' {...a11yProps(0)} />
            <Tab label='Change your Password' {...a11yProps(1)} />
            <Tab label='Send Verification Email' {...a11yProps(2)} />
            <Tab label='Verify your Email' {...a11yProps(3)} />
            <Tab label='Create New Company' {...a11yProps(4)} />
            <Tab label='Subscribe' {...a11yProps(5)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <UpdateInfo />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UpdatePassword />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <SendVerifyLink />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <VerifyEmail />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <CreateCompany />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <UpdateSubscribe />
          </TabPanel>
        </Container>
      }
    />
  );
}
