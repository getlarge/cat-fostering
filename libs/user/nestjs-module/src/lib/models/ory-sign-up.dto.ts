import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { OryIdentityDto } from './ory-identity.dto';

export class OnOrySignUpDto {
  @Type(() => OryIdentityDto)
  @ValidateNested()
  identity!: OryIdentityDto;
}
