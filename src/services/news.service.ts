import { Connection } from '../data-source';
import { News, newsType } from '../models/News.model';
import { NewsLikes } from '../models/NewsLikes.model';
import { User } from '../models/user.model';
import { NewsComment } from '../models/NewsComment.model';
import { Brackets, FindOneOptions } from 'typeorm';
import { DeepPartial } from 'typeorm';
import userRepository from './user.service';

const NewsConnRepository = Connection.getRepository(News);

export default class NewsRepository {

  // static findNewsId = async(newsId: DeepPartial<News>) => {
  //   const news = await NewsConnRepository.findOne(newsId as any);
  //   return news;
  // };

  static createNews = async(newsSave: DeepPartial<News>) => {
    const news = await NewsConnRepository.save(newsSave);
    return news;
  };

  static updateNews = async(newsUpdate: {newsId: number; heading: string; newsContent: string; newsImage: string; newsType: newsType}) => {
    const id = newsUpdate.newsId;
    const updatenews = await NewsConnRepository
      .createQueryBuilder()
      .update(News)
      .set({
        newsContent: newsUpdate.newsContent,
        heading: newsUpdate.heading,
        newsImage: newsUpdate.newsImage,
        newsType: newsUpdate.newsType
      })
      .where('newsId = :newsId', { newsId: id })
      .execute();
    return updatenews;
  };

  static getAllNews = async(searchText: string, limit:number, offset:number) => {
    const news = await NewsConnRepository
      .createQueryBuilder('news')
      .andWhere(
        new Brackets((qb) => {
          qb.where('news.heading LIKE :search', { search: `%${searchText}%` })
            .orWhere('news.newsContent LIKE :search', { search: `%${searchText}%` });
        })
      ).orderBy('news.createdAt', 'DESC'); // Assuming createdAt is the field representing the creation date
    // Execute the count query to get the total count of records
    const totalCount = await news.getCount();
    if (limit != null) {
      const newsData = await news
        .limit(limit)
        .offset(offset)
        .getMany();
      return { totalCount, newsData };
    } else {
      const newsData = await NewsConnRepository
        .createQueryBuilder('news')
        .orderBy('news.createdAt', 'DESC')
        .getMany();
      return { newsData };
    }
  };

  static getNews = async(newsId:number) => {
    const singleNews = await NewsConnRepository
      .createQueryBuilder('News')
      .leftJoinAndSelect('News.user', 'user')
      .leftJoinAndSelect('News.newsLikes', 'newsLikes')
      .leftJoinAndSelect('News.newsComment', 'newsComment')
      .where('News.newsId = :newsId', { newsId })
      .getOne();
    if (!singleNews) {
      throw new Error('News not found');
    }

    const likeCount = singleNews.newsLikes.length;
    const commentCount = singleNews.newsComment.length;

    return { news: singleNews, likeCount, commentCount };
  };

  static addLike = async(userId: number, newsId: number) => {
    try {

      const users: User[] = await userRepository.getUserById(userId);

      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      // Assuming you want the first user from the array, adjust if needed
      const user: User = users[0];

      const news = await this.getNews(newsId);

      if (!news) {
        throw new Error('News not found');
      }

      // Check if the user has already liked the news
      const existingLike = await NewsLikes.findOne({
        where: {
          user: { id: userId }, // Adjust this based on your User entity structure
          news: { newsId: newsId }, // Adjust this based on your News entity structure
          deletedAt: false,
        },
      });

      if (existingLike) {
        // If the user has already liked, soft delete the entry
        existingLike.deletedAt = true;
        await existingLike.save();
        return { message: 'Like removed successfully' };
      } else {
        const existingLikeNotDelete = await NewsLikes.findOne({
          where: {
            user: { id: userId }, // Adjust this based on your User entity structure
            news: { newsId: newsId }, // Adjust this based on your News entity structure
            deletedAt: true,
          },
        });

        if (existingLikeNotDelete) {
          existingLikeNotDelete.deletedAt = false;
          await existingLikeNotDelete.save();
          // return { message: 'Like removed successfully' };
          return { message: 'Like added successfully' };
        } else {
          const newLike = new NewsLikes();
          newLike.user = user;
          newLike.news = news.news;
          newLike.newsLikeDate = new Date();
          newLike.deletedAt = false;
          await newLike.save();

          return { message: 'Like added successfully' };
        }
      }
    } catch (error) {
      throw new Error('Failed to add/remove like');
    }
  };

  static addComment = async(user: User, news: News, newComments: string) => {
    try {
      const newsComment = new NewsComment();
      newsComment.user = user;
      newsComment.news = news;
      newsComment.newsComments = newComments;
      newsComment.newsCommentDate = new Date();
      await newsComment.save();
      return { message: 'Comment added successfully' };
    } catch (error) {
      throw new Error('Failed to add comment');
    }
  };

  static getNewsComment = async(newsId: number) => {
    try {
      const getNewsComment = await NewsConnRepository
        .createQueryBuilder()
        .select([
          'user.id AS userId',
          'user.firstName',
          'user.lastName',
          'user.profilePic',
          'newsComment.newsComments',
          'newsComment.newsCommentDate',
        ])
        .from('newsComment', 'newsComment')
        .leftJoin('newsComment.user', 'user')
        .where('newsComment.news.newsId = :newsId', { newsId })
        .orderBy('newsComment.newsCommentId', 'DESC')
        .getMany();
      return getNewsComment;
    } catch (error) {
      // Handle the error, you can log it for debugging purposes
      console.error('Error occurred while fetching news comments:', error);
    }
  };

  // Method to delete a news item by its ID
  static deleteNews = async(newsId: number) => {
    try {
      const findOptions: FindOneOptions<News> = {
        where: { newsId: newsId }, // Assuming 'id' is the name of the column in your News entity representing the news item ID
      };
      const news = await NewsConnRepository.findOne(findOptions);
      if (!news) {
        return null;
      }
      await NewsConnRepository.remove(news);
      return news;
    } catch (error) {
      console.error(error);
    }
  };

  static deleteNewsImage = async(newsId: number) => {
    try {
      const deleteImage = await NewsConnRepository
        .createQueryBuilder()
        .update(News)
        .set({ newsImage: null }) // Set newsImage to null to delete the image
        .where('newsId = :id', { id: newsId })
        .execute();
      return deleteImage;
    } catch (error) {
      console.error(error); // Handle or log the error accordingly
    }
  };

}