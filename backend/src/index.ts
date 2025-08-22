import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import db from './db';
import checklistRoutes from './routes/checklistRoutes';
import documentRoutes from './routes/documentRoutes';
import companyRoutes from './routes/companyRoutes';
import questionRoutes from './routes/questionRoutes';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', checklistRoutes);
app.use('/api', documentRoutes);
app.use('/api', companyRoutes);
app.use('/api', questionRoutes);

db.migrate.latest().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

