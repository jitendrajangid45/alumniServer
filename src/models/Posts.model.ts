import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.model';


@Entity({ name: 'posts' })
export class Posts {
    @PrimaryGeneratedColumn()
      postId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @Column({ type: 'text', nullable: true })
      postText: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      postFilePath: string;

    @Column({ nullable: true })
      title: string;

    @Column()
      subtitle: string;

    @Column('text')
      content: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      profileImg: string;

      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
        createdAt: Date;
}
