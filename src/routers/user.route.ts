import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { verifyJWT } from '../utils/auth.util';
import { uploadDoc } from '../middlewares/multer.middleware';

const router = Router();

/**
 * @author : Jitendra Jangid
 * @description : created for all users data
 * @param : no parameter
 */

router.get('/getUsers', userController.getAllUsers);
/**
 * @author : Rutuja Gherade
 * @description: Get upcoming birthdays
 * @route: GET /getUpcomingBirthdays
 */
router.get('/getUpcomingBirthdays', userController.getUpcomingBirthdays);

router.get('/getUserDetails', verifyJWT, userController.getUserDetails);

router.get('/getAllUsers', verifyJWT, userController.getAllUser);

router.post('/uploadProfile', verifyJWT, uploadDoc.single('file'), userController.uploadPic);

router.post('/saveUserDetails', verifyJWT, userController.saveUserDetails);

router.get('/getColleges', verifyJWT, userController.getColleges);

router.get('/getCollegeCourses', verifyJWT, userController.getCollegeCourses);

/**
 * @author : Karthik Ganesan
 * @description : Route for Get Alumni Profile Details.
 * @method : GET
 * @endpoint : /api/user/getProfileData
 * @middleware : verifyJWT
 */
router.get('/getProfileData', verifyJWT, userController.getProfileData);

export default router;