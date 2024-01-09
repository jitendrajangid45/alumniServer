import { Router } from 'express';
import batchController from '../controllers/batch.controller';
import { verifyJWT } from '../utils/auth.util';


const router = Router();

router.post('/addBatch', verifyJWT, batchController.addBatch);

router.get('/getBatches', verifyJWT, batchController.getBatches);

router.get('/getColleges', verifyJWT, batchController.getCollegeByName);

router.get('/getAllBatches', verifyJWT, batchController.getAllBatches);

router.get('/getBatchStudents', verifyJWT, batchController.getBatchStudents);

router.get('/getYearwiseBatches', verifyJWT, batchController.getYearwiseBatches);

router.get('/getBatchesDropdown', verifyJWT, batchController.getBatchData);

export default router;