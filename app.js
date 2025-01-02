import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import các models
import User from './models/userModel.js'; 
import Task from './models/taskModel.js'; 
import Comment from './models/CommentModel.js'; 

// Import các routes
import taskRoutes from './routes/taskRoute.js'; 
import homeRoutes from './routes/homeRoute.js';
import importantRoutes from './routes/importantRoute.js';
import completedRoutes from './routes/completedRoute.js';
import loginRoutes from './routes/loginRoute.js';
import signupRoutes from './routes/signupRoute.js';
import todayRoutes from './routes/todayRoute.js';
import searchRoutes from './routes/searchRoute.js';
import commentRoutes from './routes/commentRoute.js';
import uploadFileRoutes from './routes/uploadFileRoute.js';
import forgotPasswordRoutes from './routes/forgotpasswordRoute.js';

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors());

// Middleware để parse body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối đến MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MongoDB URI không được cấu hình trong .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Đăng ký các routes
app.use('/api/tasks', taskRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/important', importantRoutes);
app.use('/api/completed', completedRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/today', todayRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploadfile', uploadFileRoutes);
app.use('/api/auth', forgotPasswordRoutes);

// Route render tất cả users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Tìm tất cả users trong MongoDB
    res.json(users); // Trả về danh sách users dưới dạng JSON
  } catch (err) {
    res.status(500).send('Error retrieving users from MongoDB');
  }
});

// Route render tất cả tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('user_id', 'name email'); // populate để lấy thông tin user
    res.json(tasks); // Trả về danh sách tasks dưới dạng JSON
  } catch (err) {
    res.status(500).send('Error retrieving tasks from MongoDB');
  }
});

// Route render tất cả comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find(); // Tìm tất cả comments trong MongoDB
    res.json(comments); // Trả về danh sách comments dưới dạng JSON
  } catch (err) {
    res.status(500).send('Error retrieving comments from MongoDB');
  }
});

// Đảm bảo API trả về kết quả mặc định
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
