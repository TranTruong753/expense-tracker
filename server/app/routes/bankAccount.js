import express from 'express';
import bankAccountController from "../controllers/bankAccountController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/create', bankAccountController.create);
router.get('/get-all-bank/:id', verifyToken,bankAccountController.getAllBankByUserId);

export default router;