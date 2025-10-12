import express from 'express';
import transactionController from '../controllers/transactionController.js';
import {verifyToken} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/create', verifyToken, transactionController.create);
router.get('/get-statement', verifyToken, transactionController.getStatement);
router.get('/get-list', verifyToken, transactionController.getListTransaction);
router.get('/get-list-from-to', verifyToken, transactionController.getListTransactionFromDayToDay);


export default router;