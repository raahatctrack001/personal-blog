
import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate, Outlet, useNavigate } from 'react-router-dom';


const PrivateRouter = () => {
    const { currentUser } = useSelector(state => state.user);
    console.log(currentUser)
  return currentUser ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default PrivateRouter