import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import {Layout , Landing, Login, Signup , Dashboard, History, Reports, Profile, Settings,Help, NoPage, EmailBody, EmailList, SendEmailConfiguration} from './pages/index.js';
import { LinkContext } from './context/LinkContext.js';
function App() {
  const [content, setContent]= useState('dashboard')
  return (
    <>
      <ToastContainer/>
      <LinkContext.Provider value={{ content, setContent }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/history" element={<History/>} />
              <Route path="/dashboard/reports" element={<Reports/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/settings" element={<Settings/>} />
              <Route path="/help" element={<Help/>} />
              <Route path="/dashboard/send-email-configurations" element={<SendEmailConfiguration/>} />
              <Route path="/dashboard/email-list" element={<EmailList/>} />
              <Route path="/dashboard/email-body" element={<EmailBody/>} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LinkContext.Provider>
    </>
  )
}

export default App
