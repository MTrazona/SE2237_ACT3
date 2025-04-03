// app.ts
import express from 'express';
import cors from 'cors';
import { router } from './routes/student';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

export default app; // 🔥 this is what Supertest will use
