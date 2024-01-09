import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity({ name: 'educationalDetails' })
export class EducationalDetails {
    @PrimaryGeneratedColumn()
      eduId: number;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: 'userId' })
      user: User;

    @Column({ type: 'varchar', length: 255, nullable: true })
      universityInstitute: string;

    @Column({ type: 'varchar', nullable: true })
      collageName: string;

    @Column({ type: 'varchar', nullable: true })
      programDegree: string;

      @Column({ type:'tinyint', default:0 })
        isPursuing:boolean;

    @Column({ type: 'year', nullable: true })
      startYear: string;

    @Column({ type: 'year', nullable: true })
      endYear: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      location: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      stream: string;
}
