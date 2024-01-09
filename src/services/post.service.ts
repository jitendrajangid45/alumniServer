import { DeepPartial } from 'typeorm';
import { Connection } from '../data-source';
import { Posts } from '../models/Posts.model';
import { postfeed } from '../models/postfeed.model';
import { User } from '../models/user.model';
import { PostsLikes } from '../models/PostsLikes.model';
import { PostsComments } from '../models/PostsComments.model';

const PostConnRepository = Connection.getRepository(postfeed);
const Postconnection = Connection.getRepository(Posts);
class PostRepository {
  static getPosts = async() => {
    const allPosts = await PostConnRepository
      .createQueryBuilder('postfeed')
      .leftJoinAndSelect('postfeed.user', 'user')
      .orderBy('postfeed.createdAt', 'DESC')
      .getMany();
    return allPosts;
  };
  static savePost = async(savePosts: DeepPartial<Posts>) => {
    try {

      const savePost = await Postconnection.save(savePosts);
      return savePost;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  static saveProfileImg = async(profileImg: string, postid: number) => {
    const updateProfileImg = await Postconnection.createQueryBuilder()
      .update(Posts)
      .set({ profileImg: profileImg })
      .where('postId = :id', { id: postid })
      .execute();
    return updateProfileImg;
  };

  static addPostLike = async(user:User, post:Posts) => {
    try {
      const postLike = new PostsLikes();
      postLike.user = user;
      postLike.post = post;
      postLike.postsLikeDate = new Date();

      await postLike.save();
      return { message: 'Like added successfully' };
    } catch (error) {
      throw new Error('Failed to add like');
    }
  };


  static addPostComment = async(post:Posts, postsCommentContent:string, user:User) => {
    try {
      const postComment = new PostsComments();
      postComment.user = user;
      postComment.post = post;
      postComment.postsCommentContent = postsCommentContent;
      postComment.postsCommentDate = new Date();
      await postComment.save();

      // Return a success message
      return { message: 'Comment added successfully' };
    } catch (error) {
      // If there's an error, throw an error with a specific message
      throw new Error('Failed to add comment');
    }
  };

  static getPostComment = async(postId: number) => {
    try {
      const getPostComment = await PostConnRepository
        .createQueryBuilder()
        .select([
          'user.id AS userId',
          'user.firstName',
          'user.lastName',
          'user.profilePic',
          'PostsComments.postsCommentContent',
          'PostsComments.postsCommentDate',
        ])
        .from('PostsComments', 'PostsComments')
        .leftJoin('PostsComments.user', 'user')
        .where('PostsComments.post.postId = :postId', { postId })
        .orderBy('PostsComments.postsCommentId', 'DESC')
        .getMany();
      return getPostComment;
    } catch (error) {
      // Handle the error, you can log it for debugging purposes
      console.error('Error occurred while fetching post comments:', error);
    }
  };

}

export default PostRepository;
