import express from 'express';
import { router } from './routes/student';
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});