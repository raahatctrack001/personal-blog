import asyncHandler from "../Utils/asyncHandler.js"
import apiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import apiResponse from "../Utils/apiResponse.js";
import bcryptjs from 'bcryptjs'
import dotenv from "dotenv";


dotenv.config({path:"./.env"})

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
            console.error('Error saving user:', err);
          });
        return {accessToken, refreshToken};
    }catch(error){
        throw new apiError(500, 'something went wrong while generating access and refresh token');
    }
}


const options = {
    httpOnly: true,
    secure: true
}
export const registerUser = asyncHandler(async (req, res, next)=>{
    console.log(req.body)
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

    console.log(isUserExists);

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
})

export const loginUser = asyncHandler(async (req, res, next)=>{
    // console.log(req.body)
    const {email, password} = req.body;
    if(
        [email, password].some(field=>field?.trim()?0:1)
    ){
        throw new apiError(409, "All fields are required!");
    }

    const currentUser = await User.findOne({email});
    if(!currentUser){
        throw new apiError(409, "User doesn't exist");
    }

    const passwordValidation = bcryptjs.compareSync(password, currentUser?.password);
    if(!passwordValidation){
        throw new apiError(409, "Credentials didn't match.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(currentUser?._id);
    const loggedInUser = await User.findById(currentUser?._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, "Login Successful!", {user: loggedInUser, accessToken, refreshToken})
        );  
})