import { Router } from "express";
import { registerUser } from "../Controllers/auth.controller.js";
import upload from "../Middlewares/multer.middleware.js";

const router = Router();

router.route('/sign-up').post(upload.none(),  registerUser)

export default router