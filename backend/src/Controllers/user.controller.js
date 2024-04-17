import asyncHandler from "../Utils/asyncHandler.js"
import apiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import apiResponse from "../Utils/apiResponse.js";
import bcryptjs from 'bcryptjs'
import { uploadOnCloudinary } from "../Services/cloudinar.yservices.js";


export const uploadProfilePicture = asyncHandler(async(req, res, next)=>{
    try {
        const profileLocalPath = req.file.path;
        console.log("profile pic is here", profileLocalPath)
        if(!profileLocalPath){
            throw new apiError(409, "please select an image!")
        }
        const response = await uploadOnCloudinary(profileLocalPath);
        if(!response){
            throw new apiError(500, "error uploading profile picutre");
        }
        // console.log(response);  
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
            throw new apiError(500, "failed to update profile picture base");
        }
        console.log(updatedUser);
        return res
            .status(200)
            .json(
                new apiResponse(200, "profile picture update SUCCESS", updatedUser)
            )
    } catch (error) {
        next(error);
        console.log(error)
    }
})

export const updateAccoutDetails = asyncHandler(async (req, res, next)=>{
    console.log('inside update controller')
    console.log(req.body)
    const {username, email, password} = req.body;
   try {
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
   } catch (error) {
    next(error);
   }
})

export const getAllUsers = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        throw new apiError(403, "you are not allowed to c all users")
    }
     try {
       const startIndex = parseInt(req.query.startIndex) || 0;
       const limit = parseInt(req.query.limit) || 9;
       const sortDirection = req.query.sort === 'asc' ? 1 : -1;
   
       const users = await User.find()
         .sort({ createdAt: sortDirection })
         .skip(startIndex)
         .limit(limit);
   
       const usersWithoutPassword = users.map((user) => {
         const { password, ...rest } = user._doc;
         return rest;
       });
   
       const totalUsers = await User.countDocuments();
   
       const now = new Date();
   
       const oneMonthAgo = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
       );
       const lastMonthUsers = await User.countDocuments({
         createdAt: { $gte: oneMonthAgo },
       });
   
       res.status(200).json(
        new apiResponse(200, "users data fetched", {
         users: usersWithoutPassword,
         totalUsers,
         lastMonthUsers,
       }));
     } catch (error) {
        // console.log(error);
       next(error);
     }
});
   
export const getUser = asyncHandler(async (req, res, next)=>{
   try {
       const user = await User.findById(req.params?.userId).select("-password")
       if(!user){
           throw new apiError(402, "User doesn't found!")
       }

       return res
           .status(200)
           .json(
               new apiResponse(200, "user found", user)
           )
   } catch (error) { 
    next(error);
   }
})

export const deleteUser = asyncHandler(async(req, res, next)=>{
    try {
        if(!req.user.isAdmin){
            throw new apiError(409, "only admin can delete a user")
        }
        if(!req.params?.userId){
            throw new apiError("failed to get the details of user to be deleted.")
        }
        const deletedUser = await User.findByIdAndDelete(req.params?.userId);
        if(!deleteUser){
            throw new apiError(500, "failed to delete user.")
        }
        return res
            .status(200)
            .json(
                new apiResponse(200, "user deleted", {data: deleteUser})
            )
    } catch (error) {
        next(error)
    }
})
