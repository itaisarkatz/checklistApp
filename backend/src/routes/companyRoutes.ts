import { Router } from 'express';
import { createCompany } from '../controllers/companyController';

const router = Router();

router.post('/companies', createCompany);

export default router;
