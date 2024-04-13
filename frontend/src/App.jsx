import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/project' element = {<Projects />} />
        <Route path='/about' element = {<About />} />
        <Route path='/dashboard' element = {<Dashboard />} />
        <Route path='sign-in' element = {<SignIn />} />
        <Route path='sign-up' element = {<SignUp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App