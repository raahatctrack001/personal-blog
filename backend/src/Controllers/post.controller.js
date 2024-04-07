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
        return res
        .status(500)
        .json(
            new apiError(500, "error in creating post.", error)
        )
    }


})


export const getPosts = async (req, res, next) => {
    // console.log(req.query);
    // throw new apiError(500, "intentional termination for unit testing.");
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      console.log(req.query)
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
      console.log(error)
    }
  };