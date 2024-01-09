import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

export enum RelationshipStatus {
    Single = 'single',
    InRelationship = 'in_relationship',
    Married = 'married',
    Divorced = 'divorced',
    Widowed = 'widowed'
}

@Entity({ name: 'userDetails' })
export class UserDetails {
    @PrimaryGeneratedColumn()
      detailsId: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
      homeTown: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      location: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      postalCode: string;

    @Column({ type: 'bigint', nullable: false })
      mobileNo: number;

    @Column({ nullable:false })
      bloodGroup:string;

    @Column({ type: 'varchar', nullable: false })
      countryCode: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
      currentCity: string;

    @Column({ type: 'bigint', nullable: false })
      homePhone: number;

    @Column({ type: 'bigint', nullable: false })
      workPhone: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
      alternateEmail: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      websitePortfolioBlog: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      facebookProfile: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      linkedinProfile: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      youtubeChannel: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      instagramProfile: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
      twitterProfile: string;

    @Column({ type: 'enum', enum: RelationshipStatus, nullable: false })
      relationshipStatus: RelationshipStatus;

    @Column({ type: 'varchar', length: 255, nullable: false })
      aboutMe: string;

      @ManyToOne(() => User, user => user.id)
      @JoinColumn({ name: 'userId' })
        user: User;

}
