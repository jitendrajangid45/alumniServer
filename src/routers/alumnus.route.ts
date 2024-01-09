import { Router } from 'express';
import AlumnusController from '../controllers/alumnus.controller';
import multer from 'multer';
import { verifyJWT } from '../utils/auth.util';

/**
 * @author : Shani Maurya
 * @description : Alumnus creating using by uploading excel files and by submitting form.
 */
/** Initializing Router */
const router = Router();

router.post('/addAlumni', AlumnusController.addAlumni);

// Handle file download requests
router.get('/downloadExcelForAddAlumni', AlumnusController.downloadExcelForAddAlumni);

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadExcelForAddAlumni', upload.single('file'), AlumnusController.uploadExcelForAddAlumni);

router.get('/', AlumnusController.getAlumnus);

router.put('/verifyUserByAdmin', verifyJWT, AlumnusController.verifyUserByAdmin);

export default router;
