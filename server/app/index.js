import express from 'express';
import logger from 'morgan';
import db from './config/db/index.js';
import dotenv from 'dotenv';
import route from './routes/index.js';
import bodyParser from 'body-parser';
import cors from "cors";
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();
db.connect();

const app = express();
// set up port
const port = process.env.PORT;

app.use(cors({
  origin: "http://localhost:5173",   
  credentials: true,                
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up route
route(app);

// --- Middleware xử lý lỗi ---
app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project with Nodejs Express and MongoDB',
  });
});

app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
