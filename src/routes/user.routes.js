import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    verifyEmail
} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/verify-email").get(verifyEmail);
router.route("/login").post(loginUser);
router.route("refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJwt, logOutUser);

export default router;
