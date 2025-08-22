import { Request, Response } from 'express';
import db from '../db';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const name = req.body.name || 'New Company';
    const [company] = await db('companies').insert({ name }).returning('*');
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
};
