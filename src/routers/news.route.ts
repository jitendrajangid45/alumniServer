import { Router } from 'express';
import newsController from '../controllers/news.controller';
import { verifyJWT } from '../utils/auth.util';
import { uploadDoc } from '../middlewares/multer.middleware';

const router = Router();
/**
   *
   * @author : Priya Sawant 10 Oct 2023
   * @description : created getAllNews route to get All News
   * @param {String} newsId - news ID of the news
   */
router.get('/getAllNews', newsController.getAllNews);

/**
   * @author : Shivram Sahu 13 Oct 2023
   * @description : created getNews route to get Specific News
   * @param {String} newsId - news ID of the news
   */
router.get('/getNews', newsController.getNews);

/**
   * @author : Priya Sawant 17 Oct 2023
   * @description : created getNewsComment route to get Specific News
   * @param {String} newsId - news ID of the news
   */
router.get('/getNewsComment', newsController.getNewsComment);

/**
   *
   * @author : Priya Sawant 09 Oct 2023
   * @description : created createNews route to get Specific News
   * @param {String} newsId - news ID of the news
   */
router.post('/createNews', verifyJWT, uploadDoc.single('file'), newsController.createNews);

/**
   *
   * @author : Priya Sawant 16 Oct 2023
   * @description : created addLike route to Post like News
   * @param {News, User} news, user
   */
router.post('/addLike', verifyJWT, newsController.addLike);

/**
   *
   * @author : Priya Sawant 17 Oct 2023
   * @description : created addComments route to Post News comment
   * @param {String} newsId - news ID of the news
   */
router.post('/addComment', verifyJWT, newsController.addComment);

/**
   *
   * @author : Priya Sawant 07 Nov 2023
   * @description : delete deleteNews route to delete Specific News
   * @param {String} newsId - news ID of the news
   */
router.delete('/deleteNews', newsController.deleteNews);

/**
   *
   * @author : Priya Sawant 03 Dec 2023
   * @description : delete deleteImage route to edited Image
   * @param {String} newsId - news ID of the news
   */
router.delete('/deleteNewsImage', newsController.deleteNewsImage);

export default router;

