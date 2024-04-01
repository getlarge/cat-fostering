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

class Moderation implements Namespace {
  related: {
    editors: SubjectSet<Group, 'members'>[];
  };

  permits = {
    edit: (ctx: Context) => this.related.editors.includes(ctx.subject),
    view: (ctx: Context) => this.permits.edit(ctx),
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
      this.related.catProfiles.every((cp) =>
        cp.related.owners.includes(ctx.subject)
      ),
    edit: (ctx: Context) => this.related.fosterUsers.includes(ctx.subject),
  };
}
