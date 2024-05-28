import { CatProfile } from '@cat-fostering/entities';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateCatProfile extends PartialType(
  PickType(CatProfile, ['name', 'age', 'description'])
) {}
