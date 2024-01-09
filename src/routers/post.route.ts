// post.route.ts

import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { uploadDoc } from '../middlewares/multer.middleware';
import { verifyJWT } from '../utils/auth.util';

const router = Router();

router.get('/getPosts', PostController.getPosts);

router.post('/savePosts', verifyJWT, uploadDoc.single('file'), PostController.savePosts);

router.post('/uploadImg', verifyJWT, uploadDoc.single('file'), PostController.uploadImg);

router.post('/addPostComment', PostController.addPostComment);

router.post('/addPostLike', PostController.addPostLike);

router.get('/getPostComment', PostController.getPostComment);

export default router;