import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    uploadProfilePicture 
} from "../Controllers/auth.controller.js";
import upload from "../Middlewares/multer.middleware.js";
import { verifyUser } from "../Middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.none(),  registerUser)
router.route('/login').post(upload.none(), loginUser);
router.route('/upload-profile-picture').post(verifyUser, upload.single('profile'), uploadProfilePicture)

export default router