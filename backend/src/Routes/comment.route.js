import Router from 'express';
import { createComment } from '../Controllers/comment.controller.js';
import { verifyUser } from '../Middlewares/auth.middleware.js';
import upload from '../Middlewares/multer.middleware.js'

const router = Router();


router.route('/create-comment').post(upload.none(),  verifyUser, createComment);

export default router;