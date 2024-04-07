import { Router } from "express";
import { 
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
router.route('/delete-user').post(verifyUser, deleteUser)
router.route('/logout').post(verifyUser, logoutUser)



export default router