import Post from "../Models/post.model.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import { uploadOnCloudinary } from "../Services/cloudinar.yservices.js";
// import User from "../Models/user.model.js";
// import upload from "../Middlewares/multer.middleware.js";
// import { resolve } from "path";

export const uploadPostImage = asyncHandler(async (req, res, next)=>{
  try {
    const postLocalPath = req.file.path;
    // console.log("post pic is here", postLocalPath)
    if(!postLocalPath){
        throw new apiError(409, "please select an image!")
    }
    const response = await uploadOnCloudinary(postLocalPath);
    if(!response){
        throw new apiError(500, "error uploading post picutre");
    }       
    console.log(response);
    return res
        .status(200)
        .json(
            new apiResponse(200, "post picture update SUCCESS", response)
        )
} catch (error) {
    next(error);
    console.log(error)
}
})
export const createPost = asyncHandler(async (req, res, next)=>{
  try{
    if(!req.user)
        throw new apiError(400, "you are not an admin.");

    if(!req.user.isAdmin){
        throw new apiError(400, "Only Admins can create post. Request the ownerif you want to share your experience here.")
    }
    // throw new apiError(500, "intentional termination for unit testing!")

    const {title, content, category, postImageURL} = req.body;
    if(
        [title, content].some(field=>field?.trim()?0:1)
    ){
        throw new apiError(409, "All fields are necessary!");
    }
    // let imageURL = null;
        // const localFilePath = req.file.path;
        // if(localFilePath){
            // const response = await uploadOnCloudinary(localFilePath);
            // if(response)
                // imageURL = response.url
        // }        
        const slug = title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
            
        const newPost = await Post.create({
            title,
            content,
            category,
            author: req.user,
            postImage: postImageURL||"https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png",
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
        next(error);
    }
})

export const getPosts = asyncHandler(async (req, res, next) => {
  console.log("api fired")
    // console.log(req.query);
    // console.log(req)
    // throw new apiError(500, "intentional termination for unit testing.");
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      // console.log(req.query)
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      return res
      .status(200)
      .json(
        new apiResponse(200, "posts fetched", {
            posts,
            totalPosts,
            lastMonthPosts,
          })
      );
    } catch (error) {
      next(error);
      console.log(error)
    }
})

export const deletePost = asyncHandler(async (req, res, next)=>{
  try {
      if(!req.user?.isAdmin){
        throw new apiError(400, "You are not authorised to delete the post.");
      }
      if(req.params.userId != req.user?._id){
        throw new apiError(400, "You can only delete your own posts.");
      }
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      return res
        .status(200)
        .json(
          new apiResponse(200, "Post deleted", deletedPost)
        )   
  } catch (error) {
    next(error);
    // console.log(error)
  }

  // console.log(req.user);
  // console.log(req.user._id == req.params.userId);
  // console.log(req.params);
})

export const updatePost = asyncHandler(async (req, res, next)=>{
  try {
    if(!req.user?.isAdmin){
      throw new apiError(401, "only admin can alter the post");
    }

    if(req.params.userId != req.user?._id){
      throw new apiError(409, "you can update only your posts.")
    }

    const {title, content, category} = req.body;
    if(
      [title, content].some(field=>field?.trim()?0:1)
    ){
      throw new apiError(401, "all fields are required!");
    }
  
    let imgURL = null;
    if(req.file){
      const localFilePath = req.file?.path;
      const response = await uploadOnCloudinary(localFilePath);
      imgURL = response.url;
    }
    const newSlug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-z0-9]/g, '-');
    const updatedPost = await Post.findByIdAndUpdate(
      req.params?.postId,
      {
        $set: {
          title,
          content,
          postImage: imgURL||"https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
          slug: newSlug,
          category: category,
        },
      },
      {
        new: true,
      }
    )
    return res  
      .status(200)
      .json(
        new apiResponse(200, "post updated!", updatedPost)
      )
} catch (error) {
  next(error);
  // console.log(error) 
}
})

export const getPostByAuthor = asyncHandler(async (req, res, next)=>{
  
})
