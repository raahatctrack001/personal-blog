import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import { 
    createPost, 
    deletePost, 
    getPosts,
    updatePost,
} from "../Controllers/post.controller.js";
import upload from '../Middlewares/multer.middleware.js'
const router = Router();

router.route('/create-post').post(upload.single('postImage'), verifyUser, createPost);
router.route('/get-posts').get(getPosts);
router.route('/delete-post/:postId/:userId').delete(verifyUser, deletePost);
router.route('/update-post/:postId/:userId').put(upload.single('postImage'), verifyUser, updatePost);
export default router;