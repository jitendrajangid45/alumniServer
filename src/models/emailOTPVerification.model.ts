import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'emailOTPVerification' })
export class emailOTPVerification {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
      email: string;

    @Column({ type: 'varchar', length: 6 })
      otp: string;

    @CreateDateColumn()
      createdAt: Date;

    @UpdateDateColumn()
      updatedAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
      expirationTime: Date;
}
