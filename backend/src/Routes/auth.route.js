import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/auth.controller.js";
import upload from "../Middlewares/multer.middleware.js";

const router = Router();

router.route('/register').post(upload.none(),  registerUser)
router.route('/login').post(upload.none(), loginUser);

export default router