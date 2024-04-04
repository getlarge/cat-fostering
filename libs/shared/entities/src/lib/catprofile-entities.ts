import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fostering, FosteringSchema } from './fostering-entities';
import { User, UserSchema } from './user-entities';

export class CatProfile {
  @IsUUID()
  id!: string;

  @IsAlpha()
  @Length(3, 32)
  name!: string;

  @IsNumber()
  age!: number;

  @IsString()
  @Length(3, 300)
  description!: string;

  @IsOptional()
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  photosUrls!: string[];

  @Type(() => User)
  @ValidateNested()
  owner!: User;

  @IsOptional()
  @Type(() => Fostering)
  @ValidateNested({ each: true })
  fosterings?: Fostering[];
}

@Entity()
export class CatProfileSchema
  implements Omit<CatProfile, 'owner' | 'fosterings'>
{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column()
  description!: string;

  @Column('simple-array', { nullable: true })
  photosUrls!: string[];

  @ManyToOne(() => UserSchema, (user) => user.catProfiles)
  owner!: UserSchema;

  @OneToMany(() => FosteringSchema, (fostering) => fostering.catProfile)
  fosterings!: FosteringSchema[];
}
