import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

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

// Route mặc định
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('user_id', 'name email');
    const users = await User.find();
    const comments = await Comment.find();

    res.json({
      message: 'All data from the API',
      tasks: tasks,
      users: users,
      comments: comments
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
