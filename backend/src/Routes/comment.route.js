import Router from 'express';
import { 
    commentsOnPost, 
    createComment, 
    deleteComment, 
    likeTheComment, 
    updateComment 
} from '../Controllers/comment.controller.js';
import { verifyUser } from '../Middlewares/auth.middleware.js';
import upload from '../Middlewares/multer.middleware.js'

const router = Router();


router.route('/create-comment').post(upload.none(),  verifyUser, createComment);
router.route('/get-post-comment/:postId').get(commentsOnPost)
router.route('/delete-comment/:commentId/:userId').delete(verifyUser, deleteComment);
router.route('/update-comment/:commentId/:userId').put(upload.none(), verifyUser, updateComment)
router.route('/like-comment/:commentId').post(verifyUser, likeTheComment)

export default router;