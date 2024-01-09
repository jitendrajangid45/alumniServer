import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './user.model';
import { Events } from './Events.model';

@Entity({ name: 'eventsComments' })
export class EventsComments extends BaseEntity {
    @PrimaryGeneratedColumn()
      eventsCommentId: number;

    @Column({ type: 'varchar', nullable: false })
      eventsCommentContent: string;

    @Column({ type: 'timestamp', nullable: false })
      eventsCommentDate:Date;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

      @ManyToOne(() => Events, event => event.eventId, { nullable: false })
      @JoinColumn({ name: 'eventId' })
        event: Events;

}
