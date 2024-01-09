import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.model';
import { News } from './News.model';
import { EventType, Events } from './Events.model';
import { NewsLikes } from './NewsLikes.model';
import { NewsComment } from './NewsComment.model';


@Entity({ name: 'postfeed' })
export class postfeed {

    @PrimaryGeneratedColumn()
      id: number;

   @Column({ type:'int', nullable:true })
     postId: number;

     @Column({ type:'varchar', nullable:true })
       type: string;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;


    @Column({ type: 'varchar', length: 255, nullable: true })
      postFilePath: string;

    @Column({ nullable: true })
      postTitle: string;


    @Column('text')
      postContent: string;

      @Column({ type:'int', nullable:true })
        postsCommentId: number;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      postsCommentDate: Date;

    @Column({ type: 'text', nullable: false, comment: 'SET utf8mb4 COLLATE utf8mb4_unicode_ci' })
      postsCommentContent: string;

      @Column({ type:'int', nullable:true })
        postsLikeId: number;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      postsLikeDate: Date;

      @Column({ type:'int', nullable:true })
        newsId: number;


    @Column({ type: 'text', nullable: false })
      newsContent: string;


    @Column({ type: 'varchar', length: 255, nullable: false })
      newsHeading: string;


      @Column({ type:'int', nullable:true })
        newsCommentId: number;


    @CreateDateColumn({ type: 'timestamp', nullable: false })
      newsCommentDate: Date;

    @Column({ type: 'text', nullable: false })
      newsComments: string;


      @Column({ type:'int', nullable:true })
        newsLikeId: number;


    @CreateDateColumn({ type: 'timestamp', nullable: false })
      newsLikeDate: Date;



      @Column({ type:'int', nullable:true })
        eventId: number;

    @Column({ type: 'varchar' })
      eventTitle: string;


    @Column({ type: 'int' })
      startDate: Date;

    @Column({ type: 'varchar' })
      startTime: string;

    @Column({ type: 'int' })
      endDate: Date;

    @Column({ type: 'varchar' })
      endTime: string;

    @Column({ type: 'varchar' })
      eventVenue: string;

    @Column({ type: 'text' })
      eventAddress: string;

    @Column({ type: 'text' })
      eventDescription: string;

      @Column({ type:'int', nullable:true })
        eventsCommentId: number;

    @Column({ type: 'timestamp', nullable: false })
      eventsCommentDate: Date;

    @Column({ type: 'varchar', nullable: false })
      eventsCommentContent: string;


      @Column({ type:'int', nullable:true })
        eventLikeId: number;


    @CreateDateColumn({ type: 'timestamp', nullable: false })
      eventLikeDate: Date;

      @Column({ type: 'timestamp' })
        createdAt: Date;
}
