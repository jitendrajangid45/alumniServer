import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity, Column } from 'typeorm';
import { User } from './user.model'; // Import the User entity if it's in a separate file
import { Posts } from './Posts.model'; // Import the Post entity if it's in a separate file

@Entity({ name: 'postsLikes' })
export class PostsLikes extends BaseEntity {

    @PrimaryGeneratedColumn()
      postsLikeId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @ManyToOne(() => Posts, posts => posts.postId, { nullable: false })
    @JoinColumn({ name: 'postsId' })
      post: Posts;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      postsLikeDate: Date;

      @Column({ type: 'boolean', default: false })
        deletedAt: boolean;
}
