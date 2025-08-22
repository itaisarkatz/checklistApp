import db from '../db';
import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import pdf from 'pdf-parse';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getChecklistFromClaude = async (
  documentIds: number[],
  questions: string[],
  conditions: string[]
) => {
  const documents = await db('documents').whereIn('id', documentIds);
  const combinedContent = documents.map(doc => doc.content).join('\n\n--- End of Document ---\n\n');

  const answeredQuestions = await Promise.all(
    questions.map(async (q: string) => {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Documents:\n${combinedContent}\n\nQuestion: ${q}\n\nAnswer:`,
          },
        ],
      });
      const answer = response.content[0].type === 'text' ? response.content[0].text : "";
      return { question: q, answer: answer };
    })
  );

  const evaluatedConditions = await Promise.all(
    conditions.map(async (c: string) => {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: `Documents:\n${combinedContent}\n\nCondition: ${c}\n\nIs the condition met? Answer with only "true" or "false".`,
          },
        ],
      });
      const evaluationText = response.content[0].type === 'text' ? response.content[0].text : "false";
      return { condition: c, evaluation: evaluationText.trim().toLowerCase() === 'true' };
    })
  );

  return {
    questions: JSON.stringify(answeredQuestions),
    conditions: JSON.stringify(evaluatedConditions),
  };
};
