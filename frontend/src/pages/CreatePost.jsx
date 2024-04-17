import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useState } from 'react';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [postImage, setPostImage] = useState(null);
    const [postUploadMessage, setPostUploadMessage] = useState(null);
//   const [file, setFile] = useState(null);
//   const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

 
  const uploadPostImage = async(e)=>{
    setPublishError(null)
    try{
        const newFormData = new FormData();
        newFormData.append('postImage', e.target.files[0]);

        const res = await fetch('api/v1/post/upload-post-image', {
            method: 'POST',
            body: newFormData
        })

        const uploadResponse = await res.json();
        // console.log('upload response: ', uploadResponse.data.url)
        if(uploadResponse.success){
            setPostImage(uploadResponse.data.url);
        }
    }
    catch(error){
        setImageUploadError(error.message)
        console.log(error);
    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null)
    // formData.append('postImageURL', postImage);
    setFormData({...formData, ['postImageURL']: postImage})
    try{
        const res = await fetch('/api/v1/post/create-post', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(formData),
        });
        const responseData = await res.json();
        if(responseData.success){
            setPostUploadMessage(responseData.message);
            Navigate('/dashboard?tab=post')
        }
        else{
            setPublishError(responseData.message)
        }
    }
    catch(error){
        setPublishError(error.message)
        console.log(error)
    }
    
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      {/* {postImage && (<img src={postImage} alt='post-image' className='aspect-1/1'/>)} */}
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={uploadPostImage}
          />
          
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {postImage && (
          <img
            src={postImage}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {postUploadMessage && (
          <Alert className='mt-5' color='success'>
            {postUploadMessage}
          </Alert>
        )}
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}