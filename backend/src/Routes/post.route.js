import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import { createPost } from "../Controllers/post.controller.js";
import upload from '../Middlewares/multer.middleware.js'
const router = Router();

router.route('/create-post').post(upload.single('postImage'), verifyUser, createPost);


export default router;