import { Router } from 'express';
import db from '../db';

const router = Router();

// Get all questions for a company
router.get('/questions', async (req, res) => {
  const { companyId } = req.query;
  try {
    let query = db('questions');
    if (companyId) query = query.where({ company_id: companyId });
    const questions = await query;
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching questions.');
  }
});

// Create a new question
router.post('/questions', async (req, res) => {
  const { type, text, company_id } = req.body;
  if (!type || !text || !company_id) {
    return res.status(400).json({ error: 'type, text, and company_id are required' });
  }
  try {
    const [question] = await db('questions').insert({ type, text, company_id }).returning('*');
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating question' });
  }
});

export default router;
