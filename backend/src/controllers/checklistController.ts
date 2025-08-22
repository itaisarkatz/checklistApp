import { Request, Response } from 'express';
import db from '../db';
import { getChecklistFromClaude } from '../services/claudeService';

export const runChecklist = async (req: Request, res: Response) => {
  const { questionIds, documentIds } = req.body;

  if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
    return res.status(400).send('No documents specified.');
  }
  if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
    return res.status(400).send('No questions specified.');
  }

  try {
    // Fetch question objects from DB
    const questions = await db('questions').whereIn('id', questionIds);
    const documents = await db('documents').whereIn('id', documentIds);
    const combinedContent = documents.map(doc => doc.content).join('\n\n--- End of Document ---\n\n');

    // For each question, send to Claude and get answer
    const answeredQuestions = await Promise.all(
      questions.map(async (q) => {
        // Only send if type is 'question'
        if (q.type === 'question') {
          const { Anthropic } = require('@anthropic-ai/sdk');
          const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
          const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: `Documents:\n${combinedContent}\n\nQuestion: ${q.text}\n\nAnswer:`,
              },
            ],
          });
          const answer = response.content[0].type === 'text' ? response.content[0].text : "";
          return { id: q.id, type: q.type, text: q.text, answer };
        } else if (q.type === 'condition') {
          const { Anthropic } = require('@anthropic-ai/sdk');
          const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
          const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [
              {
                role: 'user',
                content: `Documents:\n${combinedContent}\n\nCondition: ${q.text}\n\nIs the condition met? Answer with only \"true\" or \"false\".`,
              },
            ],
          });
          const evaluationText = response.content[0].type === 'text' ? response.content[0].text : "false";
          return { id: q.id, type: q.type, text: q.text, evaluation: evaluationText.trim().toLowerCase() === 'true' };
        }
      })
    );

    // Only return answers, do not persist checklist
    res.json({ questions: answeredQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing documents.');
  }
};

export const createChecklist = async (req: Request, res: Response) => {
  const { name, company_id } = req.body;
  if (!name || !company_id) {
    return res.status(400).json({ error: 'Name and company_id are required' });
  }
  try {
    const [checklist] = await db('checklists').insert({ name, company_id }).returning('*');
    res.status(201).json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating checklist' });
  }
};

export const getChecklists = async (req: Request, res: Response) => {
  try {
    const checklists = await db('checklists').select();
    res.json(checklists);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching checklists.');
  }
};

export const getChecklistById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const checklist = await db('checklists').where({ id }).first();
    if (!checklist) return res.status(404).send('Checklist not found.');
    res.json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching checklist.');
  }
};

export const getChecklistsForCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  try {
    const checklists = await db('checklists').where({ company_id: companyId });
    res.json(checklists);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching checklists for company.');
  }
};

export const updateChecklist = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await db('checklists').where({ id }).update({ name });
    if (!updated) return res.status(404).send('Checklist not found.');
    const checklist = await db('checklists').where({ id }).first();
    res.json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating checklist.');
  }
};

export const deleteChecklist = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await db('checklists').where({ id }).del();
    if (!deleted) return res.status(404).send('Checklist not found.');
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting checklist.');
  }
};
