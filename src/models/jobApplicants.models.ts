import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user.model'; // Import the User entity if needed
import { Job } from './Jobs.model'; // Import the Job entity if needed

enum Reference {
  User = 'user',
  Friend = 'friend',
}
export enum ApplicationStatus {
  applicationSubmitted ='applicationSubmitted',
  applicationViewed ='applicationViewed',
  rejected = 'rejected',
  shortlisted ='shortlisted'
}

@Entity({ name: 'jobApplicant' })
@Index('idx_reference', ['reference'])
export class JobApplicant extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
    jobApplicantId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    applicantEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    applicantFullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    applicantRelevantSkills: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    applicantResumePath: string;

  @ManyToOne(() => User, (user) => user.job)
  @JoinColumn({ name: 'userId' }) // Specify the foreign key column
    user: User;

  @Column({ type: 'enum', enum: Reference, nullable: true })
    reference: Reference;

  @ManyToOne(() => Job, (job) => job.jobApplicant)
  @JoinColumn({ name: 'jobId' })
    job: Job;

  @Column({ type: 'text', nullable: true })
    noteForRecruiter: string;

  @Column({ type: 'bigint', nullable: true })
    mobileNumber: number;

  @Column({
    type: 'enum',
    enum: [
      'applicationSubmitted',
      'applicationViewed',
      'rejected',
      'shortlisted',
    ],
    nullable: false,
    default: 'applicationSubmitted',
  })
    applicationStatus: ApplicationStatus;

  @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
    deletedAt: Date;
}
