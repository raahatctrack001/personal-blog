import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { AiOutlineInsertRowAbove, AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeReducers';
import { SignOutSuccess } from '../redux/user/userSlice';


const header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
 
  const { theme } = useSelector(state=>state?.theme)
  // console.log(theme)
  /****************handle signout*********** */
  const handleSignout = async () => {

    try {
      const res = await fetch('/api/v1/auth/logout', {
        method: 'POST',
      });
      const data = await res.json();
    //   console.log(data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(SignOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // 
  return (
    <Navbar className='border-b-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 md:text-lg font-semibold'>
      <Link to={'/'}>
        <div className='p-1 rounded-lg'> <span className='self-center whitespace-nowrap'> Raahat's </span> Blog </div>
      </Link>
      <form>
        <TextInput 
          placeholder='search...'
          rightIcon= {AiOutlineSearch}
          className='hidden md:inline'
        />
      </form>
      <div className='flex gap-2  md:order-2'>
        <Button outline className='h-10 my-auto bg-green-500 md:hidden'> <AiOutlineSearch /> </Button>
        <Button 
        outline 
        className='w-14 h-10 my-auto bg-green-500'
        onClick={()=>dispatch(toggleTheme())}
        > {theme === 'light' ? (<FaMoon className='text-gray-800'/>) : (<FaSun />)} </Button>
        {
          currentUser ? 
          ( 
            <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar 
              className='w-16 h-14 my-auto rounded-full' 
              alt="Remy Sharp" 
              src={currentUser.photoURL} 
              rounded
            />}
            >
              <Dropdown.Header>
                <span className='block text-sm'>{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>
                  Profile
                </Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>
                Sign Out
              </Dropdown.Item>
            </Dropdown>
          ) : 
          (
            <Link to={'/sign-in'}>
              <Button outline className='h-10'> Sign In </Button>
            </Link>
        )
        }
        
        <Navbar.Toggle 
          className='my-auto'
        />
      </div>

      <Navbar.Collapse>
        <Navbar.Link as={'div'} active = {path === '/'}>
          <Link to={'/'}>
            Home
          </Link>
        </Navbar.Link>

        <Navbar.Link as={'div'} active = {path === '/about'}>
          <Link to={'/about'}>
            About
          </Link>
        </Navbar.Link>

        <Navbar.Link as={'div'} active = {path === '/project'}>
          <Link to={'/project'}>
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    
    
    </Navbar>
  )
}

export default header