import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.model';
import { NewsLikes } from './NewsLikes.model';
import { NewsComment } from './NewsComment.model';

export enum newsType {
  news = 'news',
  circular = 'circular'
}

@Entity({ name: 'news' })
export class News {
    @PrimaryGeneratedColumn()
      newsId: number;

    @ManyToOne(() => User, user => user.id, { nullable: true })
    @JoinColumn({ name: 'userId' })
      user: User;

    @OneToMany(() => NewsLikes, newsLikes => newsLikes.news, { cascade: true })
      newsLikes: NewsLikes[];

    @OneToMany(() => NewsComment, newsComment => newsComment.news, { cascade: true })
      newsComment: NewsComment[];

    @Column({ type: 'text', nullable: false })
      newsContent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
      heading: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      createdAt: Date;

      @Column({ type: 'varchar', length: 255, nullable: true })
        newsImage: string | null;

    @Column({ type: 'enum', enum: newsType, nullable: false })
      newsType: newsType; // Use 'newsType' instead of 'type'
}
