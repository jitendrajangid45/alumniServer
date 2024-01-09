import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.model';
import { News } from './News.model';

@Entity({ name: 'newsComment' })
export class NewsComment extends BaseEntity {
    @PrimaryGeneratedColumn()
      newsCommentId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @ManyToOne(() => News, news => news.newsId, { nullable: false })
    @JoinColumn({ name: 'newsIdF' })
      news: News;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      newsCommentDate: Date;

    @Column({ type: 'text', nullable: false })
      newsComments: string;

}
