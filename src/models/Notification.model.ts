import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification' })
export class Notification {
    @PrimaryGeneratedColumn()
      id: number;
}
