import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { OryIdentityDto } from './ory-identity.dto';

export class OnOrySignInDto {
  @Type(() => OryIdentityDto)
  @ValidateNested()
  identity!: OryIdentityDto;
}
