import express from 'express';
import categoriesController from "../controllers/categoriesController.js";

const router = express.Router();

router.get('/', categoriesController.getAll);
router.post('/create', categoriesController.create)
router.get('/seed', categoriesController.seedData)

export default router;