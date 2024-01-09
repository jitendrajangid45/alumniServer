import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model'; // Import the User entity if it's in a separate file

@Entity({ name: 'professionalDetails' })
export class ProfessionalDetails {
    @PrimaryGeneratedColumn()
      profId: number;

    @Column({ type: 'int', nullable: true })
      overallWorkExperience: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
      professionalSkills: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      roles: string;

    @Column({ type: 'varchar', nullable: true })
      industriesWorkIn: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
      user: User;
}
