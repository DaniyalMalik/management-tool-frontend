import React from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../i18n'
import '../../assets/tailwind/tailwind.css'
import './index.css'
import { AppProvider } from '../../context/AppContext'
import { PageProvider } from '../../context/PageContext'
import App from './App'

toast.configure({
  autoClose: 3000,
  closeButton: false,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_RIGHT,
})

export const Main = () => {
  return (
    <AppProvider>
      <PageProvider>
        <App />
      </PageProvider>
    </AppProvider>
  )
}
