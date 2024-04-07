import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import { 
    createPost, 
    getPosts,
} from "../Controllers/post.controller.js";
import upload from '../Middlewares/multer.middleware.js'
const router = Router();

router.route('/create-post').post(upload.single('postImage'), verifyUser, createPost);
router.route('/get-posts').get(getPosts);

export default router;