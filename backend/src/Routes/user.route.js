import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";
import { 
    updateAccoutDetails, 
    uploadProfilePicture }
from "../Controllers/user.controller.js";

const router = Router();

router.route('/upload-profile-picture').post(verifyUser, upload.single('profile'), uploadProfilePicture)
router.route('/update-account-details').post(verifyUser, upload.none(), updateAccoutDetails)

export default router;