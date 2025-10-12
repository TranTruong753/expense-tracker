import express from 'express';
import authController from "../controllers/authController.js";
import {verifyToken} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.registerAccount);
router.get('/profile',verifyToken, authController.getProfile);
router.get('/check-token', authController.checkToken);

export default router;