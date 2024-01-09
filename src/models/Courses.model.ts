import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
    courseId: number;

  @Column({ nullable:false })
    collegeCode: number;

  @Column({ nullable:false })
    courseName:string;

     @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
       createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
    updatedAt: Date;

    @Column({ type: 'datetime', nullable: true })
      deletedAt: Date;
}