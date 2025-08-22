import { Router } from 'express';
import {
  createChecklist,
  getChecklists,
  getChecklistById,
  getChecklistsForCompany,
  updateChecklist,
  deleteChecklist,
  runChecklist
} from '../controllers/checklistController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/checklists', runChecklist);
router.get('/checklists', getChecklists);

// Get a checklist by id
router.get('/checklists/:id', getChecklistById);

// Get all checklists for a company
router.get('/company/:companyId/checklists', getChecklistsForCompany);

// Update a checklist
router.put('/checklists/:id', updateChecklist);

// Delete a checklist
router.delete('/checklists/:id', deleteChecklist);

// Minimal checklist creation (name + company_id only)
router.post('/checklists/minimal', createChecklist);

export default router;
