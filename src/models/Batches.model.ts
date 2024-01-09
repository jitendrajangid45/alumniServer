import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany, } from 'typeorm';
import { Colleges } from './Colleges.model';
import { User } from './user.model';

@Entity({ name: 'batches' })
export class Batches extends BaseEntity {
    @PrimaryGeneratedColumn()
      batchId: number;

    @Column({ nullable:true })
      collegeId:number;

    @Column({ type: 'varchar', length: 255, nullable: true, collation: 'utf8mb4_unicode_ci' })
      batchName: string;

    @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci' })
      courseName: string;

    @Column()
      batchYear:number;

    @Column({ type: 'datetime', nullable: true })
      deletedAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
      createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
      updatedAt: Date;

    // Define the many-to-one relationship with College entity
    @ManyToOne(() => Colleges, { eager: true })
@JoinColumn({ name: 'collegeId' })
      colleges: Colleges;

    @OneToMany(() => User, user => user.batch)
      user: User[];
}