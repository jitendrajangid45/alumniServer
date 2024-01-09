import { Router } from 'express';
import educationalController from '../controllers/educational.controller';
import { verifyJWT } from '../utils/auth.util';

const router = Router();

router.get('/educationalDetails', verifyJWT, educationalController.getEducationalDetails);

router.post('/saveEducationalDetails', verifyJWT, educationalController.saveEducationalDetails);

router.delete('/deleteEducationalDetail', verifyJWT, educationalController.deleteEducation);

export default router;