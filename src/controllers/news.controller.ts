import { NextFunction, Request, Response } from 'express';
import NewsRepository from '../services/news.service';
import ApiSuccess from '../api-errors/api-success-util';
import { User } from '../models/user.model';

export default class NewsController {

  public static createNews = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const details = JSON.parse(req.body.data);
      details.newsImage = req.body.newFileName;
      const newsId = details.newsId;
      details.user = userId;
      const detail = { heading:details.heading, newsContent:details.newsContent, newsImage:details.newsImage, newsId:newsId, newsType:details.newsType };
      if (newsId > 0) {
        await NewsRepository.updateNews(detail);
        return next(ApiSuccess.customSuccessResponse(200, 'updated Successfully'));
      } else {
        await NewsRepository.createNews(details);
        return next(ApiSuccess.customSuccessResponse(201, 'createNews successfully'));
      }
    } catch (error) {
      next(error);
    }
  };

  public static getAllNews = async(req: Request, res: Response) => {
    try {
      const { searchText, page } = req.query;
      let limit;
      let offset;
      if (req.query.page === 'undefined') {
        limit = null;
        offset = null;
      } else {
        limit = 6;
        offset = (parseInt(page as string, 10) - 1) * limit;
      }
      const news = await NewsRepository.getAllNews(searchText as string, limit as number, offset as number);
      res.json({ status: 200, msg: 'working properly', data: news });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static getNews = async(req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.query.newsId as string, 10); // Converting string req.query.newsId to Integer
      const news = await NewsRepository.getNews(newsId);
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static addLike = async(req: Request, res: Response) => {
    try {
      const userId = req.query.userId as User | string ;
      const { newsId } = req.body;
      const response = await NewsRepository.addLike(Number(userId), newsId);
      res.status(201).json({ status: 201, data: response }); // Send a success response
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static addComment = async(req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const userId = req.query.userId as User | string ;
      const { newsId } = req.body;
      const { newsComments } = req.body;
      const response = await NewsRepository.addComment(id, newsId, newsComments);
      res.status(201).json({ status: 201, data: response }); // Send a success response
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static getNewsComment = async(req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.query.newsId as string, 10);
      const news = await NewsRepository.getNewsComment(newsId);
      res.status(200).json({ status: 200, data: news });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Method to delete a specific news item by its ID
  public static deleteNews = async(req: Request, res: Response) => {
    try {
      const newsId = parseInt(req.query.newsId as string, 10);
      // Call the service method to delete the news item by its ID
      const deletedNews = await NewsRepository.deleteNews(newsId);
      if (!deletedNews) {
        res.status(404).json({ error: 'News item not found' });
        return;
      }
      res.status(200).json({ status: 200, msg: 'News deleted successfully', data: deletedNews });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  static deleteNewsImage = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const newsId = parseInt(req.query.newsId as string, 10);
      const deleteImage = await NewsRepository.deleteNewsImage(newsId as number);
      if (deleteImage) return next(ApiSuccess.customSuccessResponse(200, 'News Image Deleted Successfully'));
    } catch (error) {
      next(error);
    }
  };
}
