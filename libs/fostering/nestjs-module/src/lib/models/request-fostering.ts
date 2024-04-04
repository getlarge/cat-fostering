import { Fostering } from '@cat-fostering/entities';
import { PickType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';

export class RequestFostering extends PickType(Fostering, [
  'startDate',
  'endDate',
]) {
  @IsUUID()
  catProfileId!: string;
}
