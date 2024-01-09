import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { User } from './user.model';
import { News } from './News.model';

@Entity({ name: 'newsLikes' })
export class NewsLikes extends BaseEntity {
    @PrimaryGeneratedColumn()
      newsLikeId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @ManyToOne(() => News, news => news.newsId, { nullable: false })
    @JoinColumn({ name: 'newsIdF' })
      news: News;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      newsLikeDate: Date;

    @Column({ type: 'boolean', default: false })
      deletedAt: boolean;
}
