import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom';


const AdminPrivateRouter = () => {
    const { currentUser } = useSelector(state => state.user);
    // console.log(currentUser)
    console.log(currentUser)
  return currentUser?.isAdmin ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default AdminPrivateRouter