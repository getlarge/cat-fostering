import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
  IsEmail,
  IsOptional,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CatProfile, CatProfileSchema } from './catprofile-entities';
import { Fostering, FosteringSchema } from './fostering-entities';

export class User {
  @IsUUID()
  id!: string;

  @IsAlpha()
  @Length(3, 32)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @Type(() => CatProfile)
  @IsArray()
  @ValidateNested({ each: true })
  catProfiles?: CatProfile[];

  @IsOptional()
  @Type(() => Fostering)
  @IsArray()
  @ValidateNested({ each: true })
  fosteringActivities?: Fostering[];
}

@Entity()
export class UserSchema implements Pick<User, 'name' | 'email'> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index()
  @Column()
  email!: string;

  @OneToMany(() => CatProfileSchema, (catprofile) => catprofile.owner)
  catProfiles?: CatProfileSchema[];

  @OneToMany(() => FosteringSchema, (fostering) => fostering.participant)
  fosteringActivities?: FosteringSchema[];
}
