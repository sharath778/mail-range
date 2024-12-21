import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import {Layout , Landing, Login, Signup , Dashboard, History, Reports, Profile, Settings,Help, NoPage, EmailBody, EmailList, SendEmailConfiguration} from './pages/index.js';
import { LinkContext } from './context/LinkContext.js';
function App() {
  const [content, setContent]= useState('dashboard');
  const token = localStorage.getItem('token');

  // Check if the token exists and assign true or false to isLoggedIn
  const isLoggedIn = token !== null && token !== '';

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
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Landing/>} />
              <Route path="/dashboard/history" element={isLoggedIn ? <History /> : <Landing />} />
              <Route path="/dashboard/reports" element={isLoggedIn ? <Reports /> : <Landing />} />
              <Route path="/profile" element={isLoggedIn ? <Profile /> : <Landing />} />
              <Route path="/settings" element={isLoggedIn ? <Settings /> : <Landing />} />
              <Route path="/help" element={isLoggedIn ? <Help /> : <Landing />} />
              <Route path="/dashboard/send-email-configurations" element={isLoggedIn ? <SendEmailConfiguration /> : <Landing />} />
              <Route path="/dashboard/email-list" element={isLoggedIn ? <EmailList /> : <Landing />} />
              <Route path="/dashboard/email-body" element={isLoggedIn ? <EmailBody /> : <Landing />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LinkContext.Provider>
    </>
  )
}

export default App
