import { User, UserSchema } from '@cat-fostering/user-entities';
import {
  IsAlpha,
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Fostering, FosteringSchema } from '@cat-fostering/fostering-entities';

export class CatProfile {
  @IsUUID()
  id!: string;

  @IsAlpha()
  @Length(3, 32)
  name!: string;

  @IsNumber()
  age!: number;

  @IsAlpha()
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

  @OneToMany(() => Fostering, (fostering) => fostering.catProfile)
  fosterings!: FosteringSchema[];
}
