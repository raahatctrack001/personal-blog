import asyncHandler from '../Utils/asyncHandler.js';
import apiError from '../Utils/apiError.js';
import  apiResponse from '../Utils/apiResponse.js';
import Comment from '../Models/comment.model.js';
import Post from '../Models/post.model.js';
import User from '../Models/user.model.js';
import { isError } from 'util';

export const createComment = asyncHandler(async (req, res, next)=>{
    const { comment, postId, userId } = req.body;
    try {
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
            next(error)
            console.log(error);
        }
    } catch (error) {
        next(error);
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
        next(error)
        console.log(error);
    }
})

export const deleteComment = asyncHandler(async (req, res, next)=>{
    console.log(req.params);
    try {        
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
            next(error)
            console.log(error)
        }
    } catch (error) {
        next(error);
    }
})

export const updateComment = asyncHandler(async (req, res, next)=>{
    // console.log(req.params)
    // console.log("updating comments...")
    // console.log(req.body)
    
    const {comment} = req.body;
    console.log(comment)//must destructure otherwise string and object are diff
    // throw new apiError(500, "intentional termination for unit testing")
    
    // console.log(req.user);
    // console.log(req.params);
    try {
        if(req.user?._id != req.params?.userId){
            throw new apiError(409, "you can update only your comment");
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params?.commentId,
            {
                $set: {
                    comment
                },
            },
            {
                new: true
            }
        );
    
        console.log(updatedComment);
        if(!updatedComment){
            throw new apiError(200, "Failed to update comment")
        }
    
        return res  
            .status(200)
            .json(
                new apiResponse(200, "comment updated", updatedComment)
            )
    } catch (error) {
        next(error)
        console.log(error);
    }
})

export const likeTheComment = asyncHandler(async (req, res, next)=>{
    
    // throw new apiError(500, "intentional termination for unit testing")
    try {
        const comment = await Comment.findById(req.params?.commentId)
        if(!comment){
            throw new apiError(400, "Comment not found");
        }
        
        const index = comment.likes.indexOf(req.user?._id);
        // console.log(index)
        let todo;
        if(index == -1){
            todo = 1;
        }
        else{
            todo = 0;
        }
        todo ? (await comment.likes.push(req.user)) : (await comment.likes.splice(index, 1));
        await comment
            .save()
            .catch(error=>console.log(error));
        
        const likedComment = await Comment.findById(req.params?.commentId);
        const likersCount = likedComment.likes.length;
    
        return res
            .status(200)
            .json(
                new apiResponse(200, "liked comment", {likedComment, likersCount })
            )
    } catch (error) {
        next(error)
        console.log(error)
    }
})