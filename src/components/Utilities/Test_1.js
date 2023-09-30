// import React, { useEffect } from 'react';
// import socketIOClient from 'socket.io-client';

// const App = () => {
//   const socket = socketIOClient(
//     process.env.REACT_APP_BASE_URL_BACKEND_SOCKET_IO,
//   );

//   useEffect(() => {
//     socket.on('checking', (data) => console.log(data, 'data'));

//     return () => {
//       socket.removeListener('checking');
//     };
//   }, []);

//   const doSomething = () => {
//     socket.emit('checking', 'checking');
//   };

//   return <div onClick={doSomething}>Hello World!</div>;
// };

// export default App;
