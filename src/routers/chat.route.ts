import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { uploadDoc } from '../middlewares/multer.middleware';
const router = Router();

/**
 * @author : Jitendra Jangid
 * @description : created for all users message data
 * @param : sender_id and receiver_id
 */

router.post('/Messages', chatController.sendData);

router.post('/FindChatId', chatController.findChatId);

router.post('/sharedFiles', uploadDoc.single('file'), chatController.whatsappFile);

// router.post('/MessagesDelivery', chatController.messageDelivery);

router.get('/getKnownUsers', chatController.getKnownUsers);

router.get('/notificationCount', chatController.notificationCount);

export default router;