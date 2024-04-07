import User from "../Models/user.model.js";
import apiError from "../Utils/apiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyUser = asyncHandler(async (req, res, next)=>{
    // console.log(req.cookies);
    try {
        const accessToken = req.cookies?.accessToken;
        if(!accessToken){
            throw new apiError(400, "You are not authorised person to commit change here.");
        }
    
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken){
            throw new apiError(400, "Unauthorised attempt")
        }
    
        const currentUser = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!currentUser){
            throw new apiError(500, "Access token expired or used");
        }
        req.user = currentUser;
        next();  
    } catch (error) {
        console.log(error);
    }
})