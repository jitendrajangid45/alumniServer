// post.controller.ts

import { NextFunction, Request, Response } from 'express';
import postRepository from '../services/post.service';
import ApiSuccess from '../api-errors/api-success-util';

export class PostController {
  public static getPosts = async(req: Request, res: Response, next:NextFunction) => {

    try {

      const posts = await postRepository.getPosts();
      if (posts) return next(ApiSuccess.customSuccessResponse(200, posts));
    } catch (error) {
      console.error('Error fetching posts:', error);
      next(error);
    }
  };
  public static savePosts = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const save = req.body;
      save.postFilePath = req.body.newFileName;
      save.user = req.query.userId;
      const data = await postRepository.savePost(save);
      return next(ApiSuccess.customSuccessResponse(200, 'Saved Successfully'));
    } catch (error) {
      next(error);
    }
  };

  public static uploadImg = async(req:Request, res:Response, next:NextFunction) => {
    try {
      //const userId = parseInt(req.query.userId as string, 10);
      const profileImg = req.body.newFileName;
      const userId = 1;
      await postRepository.saveProfileImg(profileImg as string, userId as number);
      return res.json({
        status:200,
        message:'success'
      });
    } catch (error) {
      next(error);
    }
  };

  public static addPostLike = async(req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const { postId } = req.body;
      const response = await postRepository.addPostLike(id, postId);
      res.status(201).json({ status: 201, data: response }); // Send a success response
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static addPostComment = async(req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const postId = req.body.Id;
      const postsCommentContent = req.body.content;
      const response = await postRepository.addPostComment(postId, postsCommentContent, userId);
      res.status(201).json({ status: 201, data: response }); // Send a success response
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static getPostComment = async(req: Request, res: Response) => {
    try {
      const postId = parseInt(req.query.postId as string, 10);
      const post = await postRepository.getPostComment(postId);
      res.status(200).json({ status: 200, data: post });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

