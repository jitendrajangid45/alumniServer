import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model'; // Import the User entity if it's in a separate file

@Entity({ name: 'workingDetails' })
export class WorkingDetails {
    @PrimaryGeneratedColumn()
      workId: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
      companyName: string;

    @Column({ type: 'tinyint', default:0 })
      isWorking: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
      position: string;

    @Column({ nullable:true })
      joiningMonth:string;

    @Column({ nullable:true })
      joiningYear:string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      leavingMonth: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      leavingYear: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
      user: User;
}
