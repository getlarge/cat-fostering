import {
  CatProfile,
  CatProfileSchema,
} from '@cat-fostering/catprofile-entities';
import { User, UserSchema } from '@cat-fostering/user-entities';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';

export enum FosteringStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class Fostering {
  @IsUUID()
  id!: string;

  @IsDate()
  startDate!: Date;

  @IsDate()
  endDate!: Date;

  @IsEnum(FosteringStatus)
  status!: FosteringStatus;

  @Type(() => CatProfile)
  @ValidateNested()
  catProfile!: CatProfile;

  @Type(() => User)
  @ValidateNested()
  participant!: User;
}

@Entity()
export class FosteringSchema
  implements Pick<Fostering, 'startDate' | 'endDate' | 'status'>
{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Index()
  @Column()
  status!: FosteringStatus;

  @ManyToOne(() => CatProfileSchema, (catProfile) => catProfile.fosterings)
  catProfile!: string;

  @ManyToOne(() => UserSchema, (user) => user.fosteringActivities)
  participant!: UserSchema;
}
