import React, { useEffect, useRef, useState } from 'react'
import { TextInput, Button, Label } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const { currentUser } = useSelector(state => state.user);
 
  const [localImageFile, setLocalImageFile] = useState('');
  // console.log(currentUser)
  const [currentProfileURL, setCurrentProfileURL] = useState(currentUser.photoURL);
  const [formData, setFormData] = useState({});
  const updateProfile = async (file)=>{
    dispatch(updateStart())
    try {
      const res = await fetch('/api/v1/user/upload-profile-picture', {
        method:"POST",
        body: file,
      });
      
      const data = res.json();
      console.log(data);
      if(res.success){
        dispatch(updateSuccess(data));
        // currentProfileURL = data.
        // localImageFile = null;
      }
    } catch (error) {
      dispatch(updateFailure(error))
      console.log(error);
    }
  }
  const handleImageChange = (e)=>{
    e.preventDefault();
    setLocalImageFile(e.target.files[0]);
    const newFormData = new FormData();
    newFormData.append('profile', localImageFile);

    updateProfile(newFormData)
  }
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})    
  }
 
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      console.log('hello')
      const res = await fetch('/api/v1/user/update-account-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data); 
      
    } catch (error) {
      console.log(error)
    }
  }
 
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
         
          <img
            src={currentProfileURL || currentUser.photoURL}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
          />
        </div>
        
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline> Update
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>
          Delete Account
        </span>
        <span className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {/* {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )} */}
      {/* <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
}


export default DashProfile