import { Identity, IdentityStateEnum } from '@ory/client';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

/**
 * @description OryIdentityTraitDto
 * @see infra/ory-kratos/identity.schema.json
 */
export class OryIdentityTraitDto {
  @Expose()
  @IsEmail()
  email!: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
export class OryIdentityDto implements Identity {
  @Expose()
  @IsUUID()
  id!: string;

  @Expose()
  @IsString()
  schema_id!: string;

  @Expose()
  @IsString()
  schema_url!: string;

  @Expose()
  @IsNotEmptyObject()
  @Type(() => OryIdentityTraitDto)
  @ValidateNested()
  traits!: OryIdentityTraitDto;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  state?: IdentityStateEnum;

  @Expose()
  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  recovery_addresses?: Identity['recovery_addresses'];

  @Expose()
  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  verifiable_addresses?: Identity['verifiable_addresses'];

  @Expose()
  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  credentials?: Identity['credentials'];

  @Expose()
  @IsObject()
  @IsOptional()
  metadata_public?: { id: string };

  @Expose()
  @IsObject()
  @IsOptional()
  metadata_admin?: Identity['metadata_admin'];

  @Expose()
  @IsString()
  @IsOptional()
  created_at?: string;

  @Expose()
  @IsString()
  @IsOptional()
  updated_at?: string;

  @Expose()
  @IsString()
  @IsOptional()
  state_changed_at?: string;
}
