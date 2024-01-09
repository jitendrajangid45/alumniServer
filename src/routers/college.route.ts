import { Router } from 'express';
import { CollegeController } from '../controllers/college.controller';
import { uploadDoc } from '../middlewares/multer.middleware';
import { verifyJWT } from '../utils/auth.util';

const router = Router();


router.get('/getColleges', verifyJWT, CollegeController.getColleges);

router.get('/getCollegeCourses', verifyJWT, CollegeController.getCollegeCourses);

router.post('/addCollege', verifyJWT, uploadDoc.single('file'), CollegeController.addCollege);

router.delete('/deleteCollegeLogo', verifyJWT, CollegeController.deleteCollegeLogo);

router.post('/addCourse', verifyJWT, CollegeController.addCourse);

router.delete('/deleteCourse', verifyJWT, CollegeController.deleteCourse);

export default router;