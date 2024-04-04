import { CurrentUser, getCurrentUser } from '@cat-fostering/nestjs-utils';
import {
  createRelationQuery,
  relationTupleBuilder,
} from '@getlarge/keto-relations-parser';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { RequestFostering } from './models/request-fostering';

export const participantRelationQuery = (
  fosteringId: string,
  userId: string
) => {
  const relationTuple = relationTupleBuilder()
    .subject('User', userId)
    .isIn('fosterUsers')
    .of('Fostering', fosteringId);
  return createRelationQuery(relationTuple.toJSON()).unwrapOrThrow();
};

export const catProfileRelationQuery = (
  fosteringId: string,
  catProfileId: string
) => {
  const relationTuple = relationTupleBuilder()
    .subject('CatProfile', catProfileId)
    .isIn('catProfiles')
    .of('Fostering', fosteringId);
  return createRelationQuery(relationTuple.toJSON()).unwrapOrThrow();
};

export const canRequestFosteringPermission = (
  ctx: ExecutionContext
): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  const catProfileId = (req.body as RequestFostering).catProfileId;
  return relationTupleBuilder()
    .subject('User', currentUserId)
    .isAllowedTo('foster')
    .of('CatProfile', catProfileId)
    .toString();
};

export const canApproveFosteringPermission = (
  ctx: ExecutionContext
): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  return relationTupleBuilder()
    .subject('User', currentUserId)
    .isAllowedTo('approve')
    .of('Fostering', req.params['id'])
    .toString();
};

export const canRejectFosteringPermission = (ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  return relationTupleBuilder()
    .subject('User', currentUserId)
    .isAllowedTo('reject')
    .of('Fostering', req.params['id'])
    .toString();
};

export const canReadFosteringPermission = (ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  return relationTupleBuilder()
    .subject('User', currentUserId)
    .isAllowedTo('read')
    .of('Fostering', req.params['id'])
    .toString();
};
