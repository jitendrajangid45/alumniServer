import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    sender_id: number;

  @Column()
    receiver_id:number;

  @Column()
    chat_id: number;

  @Column('text')
    messages: string;

  @Column('text', { nullable: true })
    file:string;

  @Column({ default: false })
    delivered: boolean;

  @Column({ default: false })
    read: boolean;

  @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
