import axios from 'axios';

import {
  createCat,
  createOryAdminRelation,
  createOryUser,
  TestUser,
} from './helpers';

describe('E2E API tests', () => {
  let user1: TestUser;
  let user2: TestUser;

  beforeAll(async () => {
    user1 = await createOryUser({
      email: 'admin@test.it',
      password: 'p4s$worD!',
    });
    createOryAdminRelation({ userId: user1.id });

    user2 = await createOryUser({
      email: 'user@test.it',
      password: 'p4s$worD!',
    });
  });

  describe('GET /api', () => {
    it('should return a message', async () => {
      const res = await axios.get(`/api`);

      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Hello API' });
    });
  });

  describe('GET /api/users/current-user', () => {
    it('should return the current user', async () => {
      const res = await axios.get(`/api/users/current-user`, {
        headers: {
          Authorization: `Bearer ${user1.sessionToken}`,
        },
      });

      expect(res.status).toBe(200);
      expect(res.data.email).toBe(user1.email);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await axios.get(`/api/users/current-user`);

      expect(res.status).toBe(401);
    });

    it('should return 401 if an invalid token is provided', async () => {
      const res = await axios.get(`/api/users/current-user`, {
        headers: {
          Authorization: `Bearer ory_st_invalid`,
        },
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/cat-profiles', () => {
    it('should create a cat profile', async () => {
      const res = await axios.post(
        `/api/cat-profiles`,
        {
          name: 'Godard',
          description: 'Black and white cat, knows how to open doors',
          age: 3,
        },
        {
          headers: {
            Authorization: `Bearer ${user1.sessionToken}`,
          },
        }
      );

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /api/cat-profiles/:id', () => {
    it('should update a cat profile when user is the owner', async () => {
      const cat = await createCat({
        name: 'Romeo',
        description: 'Grey cat, loves to cuddle',
        age: 2,
        sessionToken: user1.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        {
          age: 3,
        },
        {
          headers: {
            Authorization: `Bearer ${user1.sessionToken}`,
          },
        }
      );

      expect(res.status).toBe(200);
    });

    it('should update a cat profile when user an admin', async () => {
      const cat = await createCat({
        name: 'Juliet',
        description: 'White cat, loves to play',
        age: 1,
        sessionToken: user2.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        {
          age: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${user1.sessionToken}`,
          },
        }
      );

      expect(res.status).toBe(200);
    });

    it(`should return 403 if the user is not an admin or the cat profile's owner`, async () => {
      const cat = await createCat({
        name: 'Crousti',
        description: 'Tabby brown, with a diva attitude',
        age: 8,
        sessionToken: user1.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        {
          age: 9,
        },
        {
          headers: {
            Authorization: `Bearer ${user2.sessionToken}`,
          },
        }
      );

      expect(res.status).toBe(403);
    });
  });
});
