import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';

const DashProfile = () => {
  const { currentUser: user  } = useSelector(state => state.user);
  const currentUser = user?.data;
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = ()=>{

  }
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('profile', selectedFile);

        try {
            const response = await fetch('/api/v1/user/upload-profile-picture', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();
            console.log(data)
            if (data.success) {
                console.log('File uploaded successfully:', data.url);
            } else {
                console.error('Upload failed:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
  return (
    <div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" name="image" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>

      <img 
        src={currentUser.photoURL}
        
        className='w-32 h-32 rounded-full aspect-square  ' 
      />
      <form className='flex flex-col gap-3'>
            <div>
              <Label className='pl-1'> Your username </Label>
              <TextInput 
                type='text'
                placeholder='username'
                id='username'
                onChange={handleChange}
              />
            </div>
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
            <Button className='w-full mt-2' type='submit'
            disabled = {loading} >
              {loading ?  <><Spinner /> <p className='pl-3'> loading... </p></>: <p>Sign Up</p> }
            </Button>
          </form>
    </div>
  )
}

export default DashProfile