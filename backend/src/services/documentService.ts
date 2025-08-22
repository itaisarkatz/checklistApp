import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import db from '../db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const processDocument = async (documentId: number, filePath: string) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfBase64 = fileBuffer.toString('base64');

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: 'Please extract the text from this PDF document.',
            },
          ],
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    await db('documents')
      .where({ id: documentId })
      .update({ content, status: 'processed' });

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    await db('documents')
      .where({ id: documentId })
      .update({ status: 'failed' });
  }
};
