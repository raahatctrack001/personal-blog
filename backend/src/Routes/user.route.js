import { Router } from "express";
import { verifyUser } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";
import { 
    deleteUser,
    getAllUsers,
    getUser,
    updateAccoutDetails, 
    uploadProfilePicture }
from "../Controllers/user.controller.js";

const router = Router();

router.route('/upload-profile-picture').post(verifyUser, upload.single('profile'), uploadProfilePicture)
router.route('/update-account-details').patch(verifyUser, upload.none(), updateAccoutDetails)
router.route('/get-all-users').get(verifyUser, getAllUsers);
router.route('/get-specific-user/:userId').get(verifyUser, getUser)
router.route('/delete-user/:userId').delete(verifyUser, deleteUser);
export default router;