// import React, { useRef, useState } from 'react'
// import { makeStyles } from '@material-ui/core/styles'
// import {
//   Modal,
//   Button,
//   TextField,
//   Box,
//   Typography,
//   Grid,
// } from '@material-ui/core'
// import axios from 'axios'

// function rand() {
//   return Math.round(Math.random() * 20) - 10
// }

// function getModalStyle() {
//   const top = 50 + rand()
//   const left = 50 + rand()

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   }
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(6, 8, 8),
//   },
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200,
//   },
// }))

// export default function Test() {
//   const classes = useStyles()
//   const [state, setState] = useState({
//     checkboxes: [],
//   })
//   const [status, setStatus] = useState('Submit')
//   const [modalStyle] = useState(getModalStyle)
//   const [open, setOpen] = useState(false)
//   const newTask = useRef('')

//   const handleOpen = () => {
//     setOpen(true)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setStatus('Sending...')
//     const { name, email, message } = e.target.elements
//     let details = {
//       //name: name.value,
//       email: email.value,
//       //message: message.value,
//     }
//     let response = await axios('http://localhost:5000/contact', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//       },
//       body: JSON.stringify(details),
//     })

//     setStatus('Submit')

//     let result = await response.json()
//     alert(result.status)
//   }

//   const handleClose = () => {
//     setOpen(false)
//   }

//   const addCheckbox = () => {
//     const { checkboxes } = state,
//       taskName = newTask.current.value

//     checkboxes.push({
//       checked: true,
//       taskName,
//     })

//     newTask.current.value = ''

//     setState({
//       checkboxes,
//     })
//   }

//   const toggleCheckbox = (index) => {
//     const { checkboxes } = state

//     checkboxes[index].checked = !checkboxes[index].checked

//     setState({
//       checkboxes,
//     })
//   }

//   const renderCheckboxes = () => {
//     const { checkboxes } = state

//     return checkboxes.map((checkbox, index) => (
//       <div key={index}>
//         <label>
//           <input
//             type="checkbox"
//             checked={checkbox.checked}
//             onChange={() => toggleCheckbox(index)}
//           />
//           {checkbox.taskName}
//         </label>
//       </div>
//     ))
//   }

//   const body = (
//     <Box style={modalStyle} className={classes.paper}>
//       <form>
//         <Grid container>
//           <Grid item md={6}>
//             <TextField label="Description" variant="outlined" fullWidth />
//             <Typography variant="h6">Attachments</Typography>
//             <TextField type="file" accept="image/*" fullWidth />
//             <Typography variant="h6">Task List</Typography>
//             {renderCheckboxes()}
//             <form onSubmit={addCheckbox}>
//               <TextField
//                 label="Task"
//                 inputRef={newTask}
//                 fullWidth
//                 variant="outlined"
//                 required
//               />
//               <Button type="submit" color="primary" variant="contained">
//                 Add Task
//               </Button>
//             </form>
//           </Grid>
//           <Grid item md={6}>
//             <Box className={classes.container} noValidate>
//               <TextField
//                 id="datetime-local"
//                 label="Due Date"
//                 fullWidth
//                 variant="outlined"
//                 type="datetime-local"
//                 defaultValue="2017-05-24T10:30"
//                 className={classes.textField}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Box>
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 type="email"
//                 id="email"
//                 label="Email"
//                 required
//                 variant="outlined"
//                 fullWidth
//               />
//               <Button type="submit" variant="contained" color="primary">
//                 {status}
//               </Button>
//             </form>
//             <Button type="submit" variant="contained" color="primary">
//               Save
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <Test />
//     </Box>
//   )

//   return (
//     <div>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="simple-modal-title"
//         aria-describedby="simple-modal-description"
//       >
//         {body}
//       </Modal>
//     </div>
//   )
// }
