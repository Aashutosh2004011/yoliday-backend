import express from 'express';
import dotenv from 'dotenv';
import sequelize from './database/database';
import cartRouter from './routes/cart.route';
import userRouter from './routes/user.route';
import categoryRouter from './routes/category.route';
import projectRouter from './routes/project.route';
import RoleRouter from './routes/role.route';
import cors from 'cors';
import path from 'path';
import fs from 'fs'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://yoliday-frontend-mu.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/upload', express.static(path.join(__dirname, '../upload')));

app.use('/role',RoleRouter)
app.use('/user',userRouter)
app.use('/category',categoryRouter)
app.use('/project',projectRouter)
app.use('/cart',cartRouter)

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});