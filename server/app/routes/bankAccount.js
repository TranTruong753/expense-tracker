import express from 'express';
import bankAccountController from "../controllers/bankAccountController.js";

const router = express.Router();

router.post('/create', bankAccountController.create);

export default router;