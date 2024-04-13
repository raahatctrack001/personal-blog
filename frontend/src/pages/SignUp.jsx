import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row gap-5 max-w-3xl md:items-center mx-auto'>
        {/* left */}
        <div className='p-3 md:p-16 rounded-xl flex-1 bg-gray-100 text-gray-800'> 
          <Link to={'/'}>
            <div className=''> 
              <span className='text-3xl font-bold'> Raahat's  Blog </span> 
            </div>
          </Link>
          <p> This is a personal blog website where you will find my writings over several topics</p>
        </div>

        {/* right  */}
        <div className='flex-1'>
          <form>
            <Label className='pl-1'> Your username </Label>
            <TextInput 
              type='text'
              placeholder='username'
              id='username'
            />
            <Label className='pl-1'> Your email </Label>
            <TextInput 
              type='text'
              placeholder='name@provider.com'
              id='email'
            />
            <Label className='pl-1'> Your password </Label>
            <TextInput 
              type='password'
              placeholder='*********'
              id='password'
              rightIcon={AiOutlineEyeInvisible}
            />
            <Button className='w-full mt-2 bg-green-100 text-green-800 hover:text-white'  type='submit'> Sign Up</Button>
          </form>        
          <p className='mt-3'> Already have an acoount? <span> <Link to={'/sign-in'} className='text-blue-500'> Sign In </Link></span></p>

        </div>
      </div>
    </div>
  )
}

export default SignUp