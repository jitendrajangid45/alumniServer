import { Router } from 'express';
import professionalController from '../controllers/professional.controller';
import { verifyJWT } from '../utils/auth.util';
const router = Router();

router.get('/getProfessionalDetails', verifyJWT, professionalController.getProfessionalDetails);

router.get('/getOverAllExperience', verifyJWT, professionalController.getOverAllExperience);

router.post('/addWorkingDetails', verifyJWT, professionalController.addWorkingDetails);

// router.post('/saveOverAllExperience',verifyJWT,professionalController.saveOverAllExperience)

router.post('/updateWorkingDetails', verifyJWT, professionalController.updateExperience);

router.post('/updateOverAllExperience', verifyJWT, professionalController.updateOverAllExperience);

router.delete('/deleteWorkingDetail', verifyJWT, professionalController.deleteWorkingDetail);

export default router;