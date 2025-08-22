import { Router } from 'express';
import { uploadDocument } from '../controllers/documentController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/documents', upload.array('documents'), uploadDocument);

export default router;
