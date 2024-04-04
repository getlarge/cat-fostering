import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CatProfile, CatProfileSchema } from './catprofile-entities';
import { User, UserSchema } from './user-entities';

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

  @Column({
    default: FosteringStatus.PENDING,
  })
  status!: FosteringStatus;

  @ManyToOne(() => CatProfileSchema, (catProfile) => catProfile.fosterings)
  catProfile!: CatProfileSchema;

  @ManyToOne(() => UserSchema, (user) => user.fosteringActivities)
  participant!: UserSchema;
}
