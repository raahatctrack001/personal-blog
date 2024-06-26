import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import { 
    createPost, 
    deletePost, 
    getPostByAuthor, 
    getPosts,
    updatePost,
    uploadPostImage,
} from "../Controllers/post.controller.js";
import upload from '../Middlewares/multer.middleware.js'
const router = Router();

router.route('/upload-post-image').post(upload.single('postImage'), verifyUser, uploadPostImage);
router.route('/create-post').post(upload.none(), verifyUser, createPost);
router.route('/get-current-user-posts/:userId').get(verifyUser, getPostByAuthor);
router.route('/get-posts').get(getPosts);
router.route('/delete-post/:postId/:userId').delete(verifyUser, deletePost);
router.route('/update-post/:postId/:userId').put(upload.single('postImage'), verifyUser, updatePost);
export default router;