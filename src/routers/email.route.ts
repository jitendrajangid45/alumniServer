import { Router } from 'express';
import EmailController from '../controllers/email.controller';
import { uploadDoc } from '../middlewares/multer.middleware';

/** Initializing Router */
const router = Router();

// Define routes for email-related actions.
router.post('/SNS', EmailController.SNS);
router.post('/Attachment', uploadDoc.array('file', 10), EmailController.Attachment);
export default router;



