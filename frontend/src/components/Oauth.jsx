import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { SignInFailure, SignInSuccess } from '../redux/user/userSlice'
import { useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
const Oauth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoURL: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            // console.log(data)
            if (res.ok){
                dispatch(SignInSuccess(data.data))
                navigate('/')
            }
        } catch (error) {
            dispatch(SignInFailure(error))
            // console.log(error);
        }
    } 
  return (
    <Button outline 
    className='mt-3 w-full'
    onClick={handleGoogleClick}
    ><AiFillGoogleCircle className='w-6 h-6'/> <p className='pl-2 my-auto'>Continue with Google</p></Button>
  )
}

export default Oauth