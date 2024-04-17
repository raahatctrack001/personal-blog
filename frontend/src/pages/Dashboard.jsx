import React, { useEffect, useState } from 'react'
import DashSideBar from '../components/DashSideBar'
import DashProfile from '../components/DashProfile'
import { useLocation } from 'react-router-dom'
import DashPosts from '../components/DashPosts'

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const getTab = urlParams.get('tab');
    if(getTab){
      setTab(getTab)
    }
  }, [location.search])
  return (
    <div>
      <div className='flex flex-col sm:flex-row'>
        {/* sidebar */}
        <div> <DashSideBar /> </div>

        {/* {right side} */}
        { tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
      </div>
    </div>
  )
}

export default Dashboard