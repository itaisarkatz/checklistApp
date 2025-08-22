import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';

const app = express();
const port = 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/checklist', upload.array('documents'), async (req, res) => {
  const { questions, conditions } = JSON.parse(req.body.data);
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).send('No documents uploaded.');
  }

  try {
    const documentContents = await Promise.all(
      files.map(file => {
        const dataBuffer = fs.readFileSync(file.path);
        return pdf(dataBuffer).then(data => data.text);
      })
    );

    const checklist = await Promise.all(
      documentContents.map(async (content) => {
        const answeredQuestions = await Promise.all(
          questions.map(async (q: string) => {
            const response = await anthropic.messages.create({
              model: 'claude-3-haiku-20240307',
              max_tokens: 1024,
              messages: [
                {
                  role: 'user',
                  content: `Document: ${content}\n\nQuestion: ${q}\n\nAnswer:`,
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
                  content: `Document: ${content}\n\nCondition: ${c}\n\nIs the condition met? Answer with only "true" or "false".`,
                },
              ],
            });
            const evaluationText = response.content[0].type === 'text' ? response.content[0].text : "false";
            return { condition: c, evaluation: evaluationText.trim().toLowerCase() === 'true' };
          })
        );

        return {
          questions: answeredQuestions,
          conditions: evaluatedConditions,
        };
      })
    );

    // Clean up uploaded files
    files.forEach(file => fs.unlinkSync(file.path));

    res.json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing documents.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
