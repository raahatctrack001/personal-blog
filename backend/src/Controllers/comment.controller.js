import asyncHandler from '../Utils/asyncHandler.js';
import apiError from '../Utils/apiError.js';
import  apiResponse from '../Utils/apiResponse.js';
import Comment from '../Models/comment.model.js';
import Post from '../Models/post.model.js';
import User from '../Models/user.model.js';

export const createComment = asyncHandler(async (req, res, next)=>{
    const { comment, postId, userId } = req.body;
    if(req.user?._id != userId){
        throw new apiError(409, "you are not allowed to comment. Please sign in.")
    }
    if(comment?.trim()?0:1){
        return;
    }
    try {
        const post = await Post.findById(postId);
        const author = await User.findById(userId).select("-password -refreshToken");
        const newComment = await Comment.create({
            comment,
            post,
            author,
        });
    if(!newComment){
        throw new apiError(407, "FAILED to comment!")
    }
    return res
        .status(200)
        .json( 
            new apiResponse(200, "comment added", newComment)
        );
        
    } catch (error) {
        console.log(error);
    }
})