import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { JobApplicant } from './jobApplicants.models';

@Entity({ name: 'Jobs' })
@Index('idx_company_name', ['companyName'])
@Index('idx_job_title', ['jobTitle'])
@Index('idx_job_location', ['jobLocation'])
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
    jobId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
    jobTitle: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    companyName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: null })
    companyWebsite: string | null;

  @Column({ type: 'int', nullable: false, default: null })
    experienceFrom: number;

  @Column({ type: 'int', nullable: false, default: null })
    experienceTo: number;

  @Column({ type: 'varchar', length: 255, nullable: false, default: null })
    contactEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: null })
    jobLocation: string;

  @Column({ type: 'json', nullable: false })
    skills: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    salaryPackage: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    salaryStipend: string | null;

  @Column({ type: 'datetime', nullable: false, default: null })
    applicationDeadline: Date | null;

  @Column({ type: 'text', nullable: false, default: null })
    jobsDescription: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    filePath: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    role: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    industryType: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    employmentType: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    department: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    education: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    visibleTo: string | null;

  @ManyToOne(() => User, (user) => user.job)
  @JoinColumn({ name: 'userId' }) // Specify the foreign key column
    user: User;

  @Column({
    type: 'enum',
    enum: ['job', 'internship'],
    nullable: false,
    default: null,
  })
    jobType: 'job' | 'internship' | null;

  @OneToMany(() => JobApplicant, (jobApplicant) => jobApplicant.job)
    jobApplicant: JobApplicant[];

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    unsigned: true,
    nullable: true,
  })
    isVerified: number;

  @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
