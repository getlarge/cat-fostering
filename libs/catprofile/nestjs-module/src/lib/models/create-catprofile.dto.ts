import { CatProfile } from '@cat-fostering/entities';
import { PickType } from '@nestjs/swagger';

export class CreateCatProfile extends PickType(CatProfile, [
  'name',
  'age',
  'description',
]) {}
