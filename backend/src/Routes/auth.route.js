import { Router } from "express";
import { 
    continueWithGoogle,
    deleteUser,
    loginUser, 
    logoutUser, 
    registerUser, 
} from "../Controllers/auth.controller.js";
import upload from "../Middlewares/multer.middleware.js";
import { verifyUser } from "../Middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.none(),  registerUser)
router.route('/login').post(upload.none(), loginUser);
router.route('/delete-user').delete(verifyUser, deleteUser)
router.route('/logout').post(verifyUser, logoutUser)
router.route('/google').post(continueWithGoogle);



export default router