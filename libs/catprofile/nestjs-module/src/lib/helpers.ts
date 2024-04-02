import { CurrentUser, getCurrentUser } from '@cat-fostering/nestjs-utils';
import {
  createRelationQuery,
  relationTupleBuilder,
} from '@getlarge/keto-relations-parser';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export function adminRelationTuple(catProfileId: string) {
  return relationTupleBuilder()
    .subject('Group', 'admin', 'members')
    .isIn('editors')
    .of('CatProfile', catProfileId);
}

export function adminRelationQuery(catProfileId: string) {
  const relationTupleWithAdminGroup = adminRelationTuple(catProfileId);
  return createRelationQuery(
    relationTupleWithAdminGroup.toJSON()
  ).unwrapOrThrow();
}
export function ownerRelationTuple(catProfileId: string, userId: string) {
  return relationTupleBuilder()
    .subject('User', userId)
    .isIn('owners')
    .of('CatProfile', catProfileId);
}

export function ownerRelationQuery(catProfileId: string, userId: string) {
  const relationTupleWithUser = ownerRelationTuple(catProfileId, userId);
  return createRelationQuery(relationTupleWithUser.toJSON()).unwrapOrThrow();
}

export const isAdminPermission = (ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  return relationTupleBuilder()
    .subject('User', currentUserId)
    .isIn('members')
    .of('Group', 'admin')
    .toString();
};

export const isOwnerPermission = (ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request & { user: CurrentUser }>();
  const currentUserId = getCurrentUser(req).id;
  const catProfileId = req.params['id'];
  return ownerRelationTuple(catProfileId, currentUserId).toString();
};
