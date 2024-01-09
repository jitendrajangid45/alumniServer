import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { User } from './user.model';
import { Posts } from './Posts.model';

@Entity({ name: 'postsComments' })
export class PostsComments extends BaseEntity {
    @PrimaryGeneratedColumn()
      postsCommentId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @ManyToOne(() => Posts, post => post.postId, { nullable: false })
    @JoinColumn({ name: 'postId' })
      post: Posts;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      postsCommentDate: Date;

    @Column({ type: 'text', nullable: false, comment: 'SET utf8mb4 COLLATE utf8mb4_unicode_ci' })
      postsCommentContent: string;
}
