import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { User } from './user.model';
import { Events } from './Events.model';

@Entity({ name: 'eventsLikes' })
export class EventsLikes extends BaseEntity {
    @PrimaryGeneratedColumn()
      eventLikeId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @ManyToOne(() => Events, event => event.eventId, { nullable: false })
    @JoinColumn({ name: 'eventId' })
      event: Events;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
      eventLikeDate: Date;
}
