import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = { <Home /> } />
        <Route path = "/sign-in" element = { <SignIn /> } />
        <Route path = "/sign-up" element = { <SignUp /> } />
        <Route path= "/about" element = { <About /> } />
        <Route path= "/dashboard" element = { <Dashboard /> } />
        <Route path= "/projects" element = {<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App