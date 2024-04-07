import Post from "../Models/post.model.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import { uploadOnCloudinary } from "../Services/cloudinar.yservices.js";

export const createPost = asyncHandler(async (req, res, next)=>{
    if(!req.user.isAdmin){
        throw new apiError(400, "Only Admins can create post. Request the ownerif you want to share your experience here.")
    }
    // throw new apiError(500, "intentional termination for unit testing!")
    if(!req.user)
        throw new apiError(400, "you are not an admin.");

    const {title, content, category} = req.body;
    if(
        [title, content].some(field=>field?.trim()?0:1)
    ){
        throw new apiError(409, "All fields are necessary!");
    }
    let imageURL = null;
    try{
        const localFilePath = req.file.path;
        if(localFilePath){
            const response = await uploadOnCloudinary(localFilePath);
            if(response)
                imageURL = response.url
        }        
        const slug = title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
            
        const newPost = await Post.create({
            title,
            content,
            category,
            author: req.user,
            postImage: imageURL||"https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png",
            slug
        });
        if(!newPost){
            throw new apiError(500, "Error saving post at database!");
        }

        return res  
            .status(200)
            .json(
                new apiResponse(200, "Post saved!", newPost )
            )
    }
    catch(error){
        console.log(error);
    }


})