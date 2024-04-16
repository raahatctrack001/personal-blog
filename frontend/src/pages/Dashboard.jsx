import React from 'react'
import DashSideBar from '../components/DashSideBar'
import DashProfile from '../components/DashProfile'

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <div>
        {/* sidebar */}
        <div> <DashSideBar /> </div>

        {/* {right side} */}
        <div> <DashProfile /> </div>
      </div>
    </div>
  )
}

export default Dashboard