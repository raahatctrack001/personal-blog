import asyncHandler from "../Utils/asyncHandler.js"
import apiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import apiResponse from "../Utils/apiResponse.js";
import bcryptjs from 'bcryptjs'
import { uploadOnCloudinary } from "../Services/cloudinar.yservices.js";
import e from "express";

export const uploadProfilePicture = asyncHandler(async(req, res, next)=>{
    console.log(req.file.path);
    const profileLocalPath = req.file.path;
    if(!profileLocalPath){
        throw new apiError(400, "please select an image!")
    }
    try {
        const response = await uploadOnCloudinary(profileLocalPath);
        if(!response){
            throw new apiError(500, "error uploading profile picutre");
        }
        console.log(response);  
        const currentUser = await User.findById(req.user?._id).select("-password -refreshToken");
        if(!currentUser){
            throw new apiError(500, "Failed to upload profile image.")
        }     
        // currentUser.photoURL = response.url;
        // await currentUser
        //     .save()
        //     .then(savedUser=>console.log(savedUser))
        //     .catch(error=>console.log("failed to update database", error))
        // console.log('updated user', updatedUser);
        //Or

        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    photoURL: response.url,
                },
            },            
            {
                new: true
            }
        ).select("-password -refreshToken");
        if(!updatedUser){
            throw new apiError(500, "failed to update data base");
        }
        console.log(updatedUser);
        return res
            .status(200)
            .json(
                new apiResponse(200, "profile udpate SUCCESS", updatedUser)
            )
    } catch (error) {
        console.log(error)
    }
})

export const updateAccoutDetails = asyncHandler(async (req, res, next)=>{
    const {username, email, password} = req.body;
    if(
        [username, email, password].some(field=>field?.trim()?0:1)
    ){
        throw new apiError(409, "All fields are required");
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const currentUser = await User.findByIdAndUpdate(
        req.user?._id, {
            $set: {
                username,
                email,
                password: hashedPassword
            },
        },
        {
            new: true
        }
    ).select("-password -refreshToken");
    if(!currentUser){
        throw new apiError(500, "FAILED to update user!")
    }
    return res  
            .status(200)
            .json(
                new apiResponse(200, "User update SUCCESS!", currentUser,)
            )
})

export const  getAllUsers = asyncHandler(async (req, res, next)=>{

})

export const getUsers = asyncHandler(async (req, res, next)=>{

})

export const getUser = asyncHandler(async (req, res, next)=>{

})