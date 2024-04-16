import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth'
import { useDispatch, useSelector } from 'react-redux'
import { SignInFailure, SignInStart, SignInSuccess } from '../redux/user/userSlice'

const SignIn = () => {
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (event)=>{
    setFormData({...formData, [event.target.id]: event.target.value});
  }
  const handleSubmit = async(event)=>{
      event.preventDefault();
      try{
        setLoading(true);
        // setErrorMessage(null);
        dispatch(SignInStart());
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        const data = await res.json();
        // console.log(data)
        if(data.success == false){
          dispatch(SignInFailure(data.message))
          // setErrorMessage(data.message)
        }
        setLoading(false)
        if(res.ok){
          dispatch(SignInSuccess(data))
          setLoading(false);
          // setErrorMessage(null);
          naviagate('/project')
        }
      }catch(error){
        dispatch(SignInFailure(error.message))
        setLoading(false);
        // setErrorMessage(error.message||"can't reach api route!")
      }

  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row gap-5 max-w-3xl md:items-center mx-auto'>
        {/* left */}
        <div className='p-3 md:p-16 rounded-xl flex-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'> 
          <Link to={'/'}>
            <div className=''> 
              <span className='text-3xl font-bold'> Raahat's  Blog </span> 
            </div>
          </Link>
          <p> This is a personal blog website where you will find my writings over several topics</p>
        </div>

        {/* right  */}
        <div className='flex-1'>
        <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
            <div>
              <Label className='pl-1'> Your email </Label>
              <TextInput 
                type='email'
                placeholder='name@provider.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className='pl-1'> Your password </Label>
              <TextInput 
                type='password'
                placeholder='*********'
                id='password'
                rightIcon={AiOutlineEyeInvisible}
                onChange={handleChange}
              />
            </div>
            <Button className='w-full mt-2' outline type='submit'
            disabled = {loading} >
              {loading ?  <><Spinner /> <p className='pl-3'> loading... </p></>: <p>Sign In</p> }
            </Button>
          </form>   
          <Oauth />
          <p className='mt-3'> Don't have an acoount? <span> <Link to={'/sign-up'} className='text-blue-500'> Sign up </Link></span></p>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>)}
        </div>
      </div>
    </div>
  )
}

export default SignIn