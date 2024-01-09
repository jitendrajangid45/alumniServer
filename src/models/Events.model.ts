import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.model';
import { EventsComments } from './EventsComments.model';

export enum EventType {
  Reunion = 'reunion',
  Webinar = 'webinar',
  Event = 'event',
}

@Entity({ name: 'events' })
export class Events {
  @PrimaryGeneratedColumn()
    eventId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
    user: User;

  @Column({ type: 'varchar' })
    eventTitle: string;

  @Column({ type: 'enum', enum: EventType })
    eventType: EventType;

  @Column({ type: 'int' })
    startDate: Date | string;

  @Column({ type: 'varchar' })
    startTime: string;

  @Column({ type: 'int', nullable: true })
    endDate: Date | string;

  @Column({ type: 'varchar' })
    endTime: string;

  @Column({ type: 'varchar' })
    eventVenue: string;

  @Column({ type: 'text' })
    eventAddress: string;

  @Column({ type: 'varchar', nullable: true })
    webinarLink: string;

  @Column({ type: 'varchar' })
    eventFilePath: string;

  @Column({ type: 'varchar' })
    isRegistration: string;

  @Column({ type: 'datetime', nullable: true })
    eventRegistrationCloseDate: Date;

  @Column({ type: 'datetime', nullable: true })
    eventRegistrationFee: number;

  @Column({ type: 'text' })
    eventDescription: string;

  @Column({ type: 'json' })
    join: JSON[];

  @Column({ type: 'json' })
    mayBe: JSON[];

  @Column({ type: 'json' })
    decline: JSON[];

  @Column({ type: 'varchar' })
    collegeOrUniversity: string;

  @Column({ type: 'varchar' })
    visibleTo: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    unsigned: true,
    nullable: true,
  })
    isVerified: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
    updatedAt: Date;

  @OneToMany(() => EventsComments, (eventComments) => eventComments.event, {
    cascade: true,
  })
    eventComments: EventsComments[];
}
