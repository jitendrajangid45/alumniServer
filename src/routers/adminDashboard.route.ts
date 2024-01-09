import { Router } from 'express';
import DashBoardController from '../controllers/adminDashboard.controller';
import { verifyJWT } from '../utils/auth.util';


const router = Router();


router.get('/getAlumniCount', DashBoardController.getAlumniCount);

router.get('/getJobBoardCount', verifyJWT, DashBoardController.getJobBoardCount);

router.get('/getEventsCount', DashBoardController.getEventsCount);

router.get('/getCollegeCount', DashBoardController.getCollegeBatchCount);

router.get('/getPostNewsCount', DashBoardController.getPostNewsCount);

export default router;