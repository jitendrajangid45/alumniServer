import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from './user.model';
import { Batches } from './Batches.model';
@Entity({ name: 'colleges' })
export class Colleges extends BaseEntity {
    @PrimaryGeneratedColumn()
      collegeId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
      collegeName: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: null })
      collegeCode: number | null;

    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
      collegeLogoPath: string | null;

    @Column({ type: 'datetime', nullable: true })
      deletedAt: Date;

    @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
      createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
      updatedAt: Date;

    @OneToMany(() => User, user => user.collage)
      users: User[];

      @OneToMany(() => Batches, (batches) => batches.colleges)
        batches: Batches[];
}