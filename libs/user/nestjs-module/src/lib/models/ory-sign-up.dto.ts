import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

import { OryIdentityDto } from './ory-identity.dto';

export class OnOrySignUpDto {
  @Type(() => OryIdentityDto)
  @ValidateNested()
  @IsNotEmptyObject()
  identity!: OryIdentityDto;
}
