// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import SwipeableViews from 'react-swipeable-views';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { AppBar, Box, Typography, Tab, Tabs } from '@material-ui/core';
// import Users from '../user/Users';
// import Companies from '../company/Companies';
// import Archive from './Archive';
// import { useSelector, useDispatch } from 'react-redux';
// import { checkCompanyOwner } from '../../actions/actionCreators/companyActions';
// import {
//   fetchUserInfo,
//   getcompanyuserscount,
// } from '../../actions/actionCreators/userActions';
// import { useHistory } from 'react-router-dom';
// import AppBarDrawer from '../headers/AppBarDrawer';

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role='tabpanel'
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}>
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

// export default function Settings() {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const { token, user, usersCount } = useSelector((state) => state.user);
//   const theme = useTheme();
//   const [value, setValue] = useState(0);
//   const [limit, setLimit] = useState('');

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleChangeIndex = (index) => {
//     setValue(index);
//   };

//   useEffect(() => {
//     if (user?._id && (user?.companyId?._id || user?.employId?._id)) {
//       dispatch(
//         getcompanyuserscount(
//           user?.companyId?._id ? user.companyId._id : user?.employId?._id,
//           token,
//         ),
//       );
//     }
//   }, [user]);

//   const checkOwner = async (e) => {
//     const res = await dispatch(
//       checkCompanyOwner(user?.companyId?._id, user?._id, token),
//     );

//     if (!res?.owner) {
//       history.push(`/${user?.firstName + ' ' + user?.lastName}/home`);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchUserInfo(token));
//     }
//   }, [token]);

//   useEffect(() => {
//     if (user?.companyId) {
//       checkOwner();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, user]);

//   useEffect(() => {
//     if (user?._id && usersCount) {
//       if (user?.companyId?.subscription === 'Bronze') {
//         setLimit('(' + usersCount + '/' + 15 + ')');
//       } else if (user?.companyId?.subscription === 'Silver') {
//         setLimit('(' + usersCount + '/' + 50 + ')');
//       } else {
//         setLimit('');
//       }
//     }
//   }, [user, usersCount]);

//   return (
//     <AppBarDrawer
//       component={
//         <div className={classes.root}>
//           <AppBar position='static' color='default'>
//             {user?._id && user?.companyId?._id ? (
//               <Tabs
//                 value={value}
//                 onChange={handleChange}
//                 indicatorColor='primary'
//                 textColor='primary'
//                 // variant="fullWidth"
//                 centered
//                 aria-label='full width tabs example'>
//                 <Tab label={`Users ${limit}`} {...a11yProps(0)} />
//                 <Tab label='Company' {...a11yProps(1)} />
//                 <Tab label='Archive' {...a11yProps(2)} />
//               </Tabs>
//             ) : (
//               <Tabs
//                 value={value}
//                 onChange={handleChange}
//                 indicatorColor='primary'
//                 textColor='primary'
//                 // variant="fullWidth"
//                 centered
//                 aria-label='full width tabs example'>
//                 <Tab label='Archive' {...a11yProps(0)} />
//               </Tabs>
//             )}
//           </AppBar>
//           {user?._id && user?.companyId?._id ? (
//             <SwipeableViews
//               axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
//               index={value}
//               onChangeIndex={handleChangeIndex}>
//               <TabPanel value={value} index={0} dir={theme.direction}>
//                 <Users />
//               </TabPanel>
//               <TabPanel value={value} index={1} dir={theme.direction}>
//                 <Companies />
//               </TabPanel>
//               <TabPanel value={value} index={2} dir={theme.direction}>
//                 <Archive />
//               </TabPanel>
//             </SwipeableViews>
//           ) : (
//             <SwipeableViews
//               axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
//               index={value}
//               onChangeIndex={handleChangeIndex}>
//               <TabPanel value={value} index={0} dir={theme.direction}>
//                 <Archive />
//               </TabPanel>
//             </SwipeableViews>
//           )}
//         </div>
//       }
//     />
//   );
// }
