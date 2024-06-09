export * from './catProfiles.service';
import { CatProfilesService } from './catProfiles.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './fostering.service';
import { FosteringService } from './fostering.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [
  CatProfilesService,
  DefaultService,
  FosteringService,
  UsersService,
];
