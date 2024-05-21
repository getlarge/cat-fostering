import type {
  Namespace,
  Context,
  SubjectSet,
  // @ts-expect-error - This is a private type from the internal Ory Keto SDK
} from '@ory/permission-namespace-types';

class User implements Namespace {}

class Group implements Namespace {
  related: {
    members: User[];
  };
}

class CatProfile implements Namespace {
  related: {
    owners: User[];
    editors: SubjectSet<Group, 'members'>[];
  };

  permits = {
    edit: (ctx: Context) =>
      this.related.owners.includes(ctx.subject) ||
      this.related.editors.includes(ctx.subject),
    foster: (ctx: Context) => !this.related.owners.includes(ctx.subject),
  };
}

class Fostering implements Namespace {
  related: {
    catProfiles: CatProfile[];
    fosterUsers: User[];
  };

  permits = {
    approve: (ctx: Context) =>
      // @ts-expect-error - This is a private type from the internal Ory Keto SDK
      this.related.catProfiles.traverse((cp: CatProfile) =>
        cp.related.owners.includes(ctx.subject)
      ),
    reject: (ctx: Context) => this.permits.approve(ctx),
    edit: (ctx: Context) => this.related.fosterUsers.includes(ctx.subject),
    read: (ctx: Context) => this.permits.approve(ctx) || this.permits.edit(ctx),
  };
}
