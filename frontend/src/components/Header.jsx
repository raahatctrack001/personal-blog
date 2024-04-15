import { Button, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { AiOutlineInsertRowAbove, AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';



const header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar className='border-b-2 bg-gray-200 text-gray-800 md:text-lg font-semibold'>
      <Link to={'/'}>
        <div className='bg-white shadow-2xl p-1 rounded-lg'> <span className='self-center whitespace-nowrap'> Raahat's </span> Blog </div>
      </Link>
      <form>
        <TextInput 
          placeholder='search...'
          rightIcon= {AiOutlineSearch}
          className='hidden md:inline'
        />
      </form>
      <Button outline className='h-10 bg-green-500 md:hidden'> <AiOutlineSearch /> </Button>
      <div className='flex gap-2 md:order-2'>
        <Button outline className='w-14 h-10 bg-green-500'> <FaMoon/> </Button>
        <Link to={'/sign-in'}>
          <Button outline className='h-10 bg-green-500 text-green-800'> Sign In </Button>
        </Link>
        <Navbar.Toggle />
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