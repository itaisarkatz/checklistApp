import { Request, Response } from 'express';
import db from '../db';
import { processDocument } from '../services/documentService';
import crypto from 'crypto';
import * as fs from 'fs';

export const uploadDocument = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { companyId } = req.body;

  if (!files || files.length === 0) {
    return res.status(400).send('No documents uploaded.');
  }

  if (!companyId) {
    return res.status(400).send('No company ID provided.');
  }

  try {
    const documentIds = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = fs.readFileSync(file.path);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        let document = await db('documents').where({ hash }).first();

        if (!document) {
          const [id] = await db('documents').insert({
            name: file.originalname,
            hash,
            company_id: companyId,
          });
          document = { id };
          processDocument(id, file.path);
        } else {
          fs.unlinkSync(file.path); // a file with the same content already exists, so we can delete the new one
        }
        return document.id;
      })
    );

    res.json({ documentIds });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing documents.');
  }
};
