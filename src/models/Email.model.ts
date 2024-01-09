import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
    to: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    from: string;

  @Column({ type: 'longtext', nullable: false })
    subject: string;

  @Column({ type: 'longtext', nullable: true })
    message: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    provider: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    delivered: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    Attachment: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    createdAt: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
    updatedAt: string;
}
