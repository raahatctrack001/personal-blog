import React, { useEffect, useRef, useState } from 'react'
import { TextInput, Button, Label, Modal, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  SignOutSuccess, 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  updateFailure, 
  updateStart, 
  updateSuccess 
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { AiFillFileText } from 'react-icons/ai';

const DashProfile = () => {
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const { currentUser } = useSelector(state => state.user);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [profileUpdate, setProfileUpdate] = useState('')
  const [updateDetails, setUpdateDetails] = useState('');

  /********************** profile picture update function *****************************/
  const updateProfile = async (file)=>{
    setUpdateDetails('');
    setProfileUpdate('');
    try {
      dispatch(updateStart())
      const res = await fetch('/api/v1/user/upload-profile-picture', {
        method:"POST",
        body: file,
      });
      
      const updatedUser = await res.json();
      console.log(updatedUser);
      if(updatedUser.success){ //not res.successs if res the its res.ok()
        setProfileUpdate(updatedUser.message)
        dispatch(updateSuccess(updatedUser.data));
      }
    } catch (error) {
      dispatch(updateFailure(updateFailure(error.message)))
      // console.log(error);
    }
  }
  const handleImageChange = (e)=>{
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append('profile', e.target.files[0]);

    updateProfile(newFormData)
  }
  const handleChange = (e)=>{
    setUpdateDetails('');
    setProfileUpdate('');
    setFormData({...formData, [e.target.id]: e.target.value})    
  }
 

  /*************************account detail update functionality******************************** */
  //mistake to improve: always keep your focus on method: get/put/post/patch/delete! it took around a day to find this bug
  //and advice: don't spend too much time in single bug keep moving forward either coming journey will let you know the solution of bug or
  //give time at last if dependency isn't that important
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setUpdateDetails('');
    setProfileUpdate('');
    try {
      console.log('hello')
      dispatch(updateStart());
      const res = await fetch('/api/v1/user/update-account-details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const updatedUser = await res.json();
      if(updatedUser.success){
        setUpdateDetails(updatedUser.message)
        dispatch(updateSuccess(updatedUser.data));
      }
      
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error)
    }
  }
  
  /***************************handle signout functionaity*********************/
  //mistake to improve: first thing after copy paste is to import all the necessary files
  const handleSignout = async () => {
    setUpdateDetails('');
    setProfileUpdate('');
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
 
  /*************************handle delete user******************** */
  const handleDeleteUser = async()=>{
      setShowModal(false);
      setUpdateDetails(null);
      setProfileUpdate(null);
      try {
        dispatch(deleteUserStart())
        const res = await fetch('/api/v1/auth/delete-user', {
          method: 'DELETE',
        });
        // console.log('res', res);
        const deletedUser = await res.json();
        // console.log('deletedUser', deletedUser)
        if(deletedUser.success){
          dispatch(deleteUserSuccess());
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
        console.log(error);
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
            src={currentUser.photoURL}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
          />
        </div>
        {profileUpdate && (<Alert color='success' className='mt-5'>
          {profileUpdate}
        </Alert>)}
        
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
          placeholder='new password (if change is required)'
          onChange={handleChange}
        />
        {updateDetails && (<Alert color='success'> {updateDetails}</Alert>)}
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline> update
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
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>
          Delete Account
        </span>
        <span className='cursor-pointer' onClick={handleSignout}>
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
      <Modal
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
      </Modal>
    </div>
  );
}


export default DashProfile