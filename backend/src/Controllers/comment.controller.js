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

export const commentsOnPost = asyncHandler(async (req, res, next)=>{
    const postId = req.params?.postId;
    try {
        const post = await Post.findById(postId);
        if(!post){
            throw new apiError(409, "no post found")
        }
        const comments = await Comment.find({post});
        if(!comments){
            throw new apiError(500, "no comments yet")
        }
        const commentsCount = comments.length;
        return res
            .status(200)
            .json(
                new apiResponse(200, "comments fetched", {comments, commentsCount})
            );
    } catch (error) {
        console.log(error);
    }
})

export const deleteComment = asyncHandler(async (req, res, next)=>{
    console.log(req.params);
    if(req.user?._id != req.params?.userId){
        throw new apiError(409, "You can delete only your comments")
    }
    try {

        const deletedComment = await Comment.findByIdAndDelete(req.params?.commentId);
        console.log(deletedComment);
        if(!deletedComment){
            throw new apiError(409, "error deleting comment")
        }
        return res  
            .status(200)
            .json(
                new apiResponse(200, "comment deleted", deleteComment)
            );
    } catch (error) {
        console.log(error)
    }
})