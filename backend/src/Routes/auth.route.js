import { Router } from "express";
import { registerUser } from "../Controllers/auth.controller.js";

const router = Router();

router.route('/sign-up').post(registerUser)

export default router