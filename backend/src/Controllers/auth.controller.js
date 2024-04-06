import asyncHandler from "../Utils/asyncHandler.js"
import apiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import apiResponse from "../Utils/apiResponse.js";


export const registerUser = asyncHandler(async (req, res, next)=>{
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
     const data = await User.findById(newUser?._id).select("-password");
    return res
        .status(200)
        .json(
            new apiResponse(200,"User registration successfull.", data)
        )
})