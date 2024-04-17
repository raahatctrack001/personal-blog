import asyncHandler from "../Utils/asyncHandler.js";
import apiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import apiResponse from "../Utils/apiResponse.js";
import bcryptjs from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config(
    {path:"./.env"}
)

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const currentUser = await User.findById(userId); //whenever there's a communication between data base ASYNC AWAIT is mendatory otherwise you will end up your whole day finding bugs
        const accessToken = currentUser.generateAccessToken();
        const refreshToken = currentUser.generateRefreshToken();
        currentUser.refreshToken = refreshToken; //for refreshing the token once access token in expired
       

        currentUser// Save or update the user document in the database
        .save()
        .then(savedUser => {
            console.log('Tokens generated and added successfully!');
          })
        .catch(err => {
            next(err)
          });
        return {accessToken, refreshToken};
    }catch(error){
        next(error);        
    }
}

const options = {
    httpOnly: true,
    secure: true
}
export const registerUser = asyncHandler(async (req, res, next)=>{
    // console.log(req.body)
    try {
        const {username, email, password} = req.body;
        if(
            [username, email, password].some(field=>field?.trim()?0:1)
        ){
            throw new apiError(400, "All fields are required!");
        }
    
        const isUserExists = await User.findOne(
            {
                $or: [{username}, {email}]
            }
        )
    
        // console.log(isUserExists);
    
        if(isUserExists){
            throw new apiError(409, "USER with this credentials already EXISTS!");
        }
        
        const newUser = await User.create({
            username,
            email,
            password
        });
        if(!newUser){
            throw new apiError(500, "Something went WRONG! while registration.")
        }
        const data = await User.findById(newUser?._id).select("-password -refreshToken");
        return res
            .status(200)
            .json(
                new apiResponse(200,"User registration successfull.", data)
            )
    } catch (error) {
        next(error);
    }
})

export const loginUser = asyncHandler(async (req, res, next)=>{
    // console.log(req.body)
    const {email, password} = req.body;
    try {
        if(
            [email, password].some(field=>field?.trim()?0:1)
        ){
            throw new apiError(409, "All fields are required!");
        }
    
        const currentUser = await User.findOne({email});
        if(!currentUser){
            throw new apiError(409, "User doesn't exist");
        }
        // const hashedPassword = bcryptjs.hashSync(password, 10);
        // console.log(hashedPassword, currentUser?.password);
        const passwordValidation = bcryptjs.compareSync(password, currentUser?.password);
        if(!passwordValidation){
            throw new apiError(409, "Credentials didn't match.");
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(currentUser?._id);
        const loggedInUser = await User.findById(currentUser?._id).select("-password -refreshToken");
        
        // console.log("accessToken: ", accessToken)
        // console.log("refreshToken: ", refreshToken)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(200, "Login Successful!", loggedInUser)
            );  
    } catch (error) {
        next(error);
    }
})

//to do's
/**
 * import vs as cloudianry
 * config cloudinary cloud name api key and secret 
 * get file.path from local files 
 * use multer to store file in local storage
 * send it to cloudinary function
 * validate localpath
 * cloudianry.upload.upload
 * upload and get reponse also unlink file * 
 */


export const deleteUser = asyncHandler(async (req, res, next)=>{
    // throw new apiError(500, 'intentional termination');
    try {
        await User.findByIdAndDelete(
            req.user?._id
        );
        return res
            .status(200)
            .json(
                new apiResponse(200, "User Deleted", null)
            )
    } catch (error) {
        next(error)
        console.log(error)
    }
    
})

export const logoutUser = asyncHandler(async (req, res, next)=>{
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    refreshToken: 1,
                }
            },
            {
                new: true,
            }
        );
        if(!updatedUser){
            throw new apiError(500, "Unable to logout User!");
        }
    
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                new apiResponse(200, "User Logged out", null)
            )
    } catch (error) {
        next(error)
    }

})

export const continueWithGoogle = asyncHandler(async (req, res, next)=>{
    // console.log(req.body)
    const {name, email, googlePhotoURL} = req.body;
    try {
        const isUserExist = await User.findOne({email})?.select("-password -refreshToken");
        console.log('alreadyexists', isUserExist)
        if(isUserExist){
            const {accessToken, refreshToken} = await generateAccessAndRefreshToken(isUserExist?._id);
            
            if(!accessToken || !refreshToken){
                throw new apiError(400, "Failed to created tokens!");
            }

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new apiResponse(200, "Login Successful!", isUserExist)
                );     
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const generatedUsername = name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);
            
            const newUser = await User.create({
                username: generatedUsername,
                password: hashedPassword,
                photoURL: googlePhotoURL,
                email,
            })?.select("-password");

            if(!newUser){
                throw new apiError(400, "failed to save data in database!")
            }
            const {accessToken, refreshToken} = await generateAccessAndRefreshToken(newUser?._id);
            const savedUser = await User.find(newUser?._id).select("-password -refreshToken");
            console.log('newUser: ', savedUser);
            return res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(
                    new apiResponse(200, 'user created!', savedUser)
                )
        }
    }catch (error) {
        // console.log(error)
        next(error);
    }
})