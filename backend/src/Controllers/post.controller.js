import asyncHandler from "../Utils/asyncHandler.js";

export const createPost = asyncHandler(async (req, res, next)=>{
    console.log("Helloe", req.user);
})