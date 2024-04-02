import { CatProfile } from '@cat-fostering/entities';
import { PickType } from '@nestjs/mapped-types';

export class CreateCatProfile extends PickType(CatProfile, [
  'name',
  'age',
  'description',
]) {}
