import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './Jobs.model';
import { Colleges } from './Colleges.model';
import { EducationalDetails } from './EducationalDetails.model';
import { UserDetails } from './UserDetails.model';
import { Batches } from './Batches.model';
import { WorkingDetails } from './WorkingDetails.model';

enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

enum AccountStatus {
    Activate = 'activate',
    Deactivate = 'deactivate'
}

export enum role {
  alumni = 'alumni',
  faculty_alumni = 'faculty_alumni',
  college_admin = 'college_admin',
  admin = 'admin',
  shop = 'shop',
}

enum Prefix {
    One = '1',
    Two = '2'
}

enum LoginType {
   normal = 'normal',
   linkedin = 'linkedin',
   google = 'google',
}

@Entity({ name: 'user' })
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    middleName: string;

  @Column({ type: 'timestamp', nullable: true })
    dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: false })
    gender: Gender;

  @Column({ type: 'varchar', length: 255, nullable: true })
    profilePic: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    unsigned: true,
    nullable: true,
  })
    isVerified: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
    registrationDate: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
    lastLoginDate: Date;

  @Column({ type: 'enum', enum: AccountStatus, nullable: false })
    accountStatus: AccountStatus;

  // Many users belong to one Collage
  @ManyToOne(() => Colleges, collage => collage.collegeCode)
  @JoinColumn({ name: 'collegeId' })
    collage: Colleges;

  // Many users belong to one Batch
  @ManyToOne(() => Batches, batch => batch.batchId)
  @JoinColumn({ name: 'batchId' })
    batch: Batches;

  @Column({ type: 'enum', enum: role, nullable: false })
    role: role;

  @Column({ type: 'enum', enum: Prefix, nullable: true })
    prefix: Prefix;

  @OneToMany(() => Job, (job) => job.user)
    job: Job[];

  @Column({ type: 'enum', enum: LoginType })
    loginType: LoginType;

  @OneToMany(
    () => EducationalDetails,
    (educationalDetails) => educationalDetails.user,
    { cascade: true }
  ) // Set up the one-to-many relationship
    educationalDetails: EducationalDetails[];

    @OneToMany(() => UserDetails, (userDetails) => userDetails.user, { cascade:true })
      userDetails:UserDetails[];

  @Column({ type: 'text', nullable: true })
    resetPasswordToken: string;

  @Column({ default: false, nullable: true })
    isOnline: boolean;

    @OneToMany(() => WorkingDetails, (workingDetails) => workingDetails.user)
      workingDetails: WorkingDetails[];
}