// src/entities/ChatRoom.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    sender_id: number;

  @Column()
    receiver_id: number;
}
