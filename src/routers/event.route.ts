import { Router } from 'express';

import { uploadDoc } from '../middlewares/multer.middleware';
import { verifyJWT } from '../utils/auth.util';
import EventController from '../controllers/event.controller';

const router = Router();

router.post('/createEvent', verifyJWT, uploadDoc.single('file'), EventController.createEvent);

router.get('/getSelfEvent', verifyJWT, EventController.getEventSelf);

router.get('/getOthersEvent', verifyJWT, EventController.getEventOthers);

router.get('/getAllEvents', verifyJWT, EventController.getAllEvent);

router.post('/updateStatus', verifyJWT, EventController.updateStatus);

router.get('/getAttendingProfile', verifyJWT, EventController.getAttendingProfileData);

router.post('/addEventComment', EventController.addEventComment);

router.post('/addEventLike', verifyJWT, EventController.addEventLike);

router.get('/getEventComment', EventController.getEventComment);

router.post('/verifyEvent', verifyJWT, EventController.verifyEvent);

export default router;