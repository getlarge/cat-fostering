import axios from 'axios';

import {
  axiosOptionsFactory,
  createCatProfile,
  createOryAdminRelation,
  createOryUser,
  TestUser,
} from './helpers';

describe('E2E CatProfiles API tests', () => {
  let user1: TestUser;
  let user2: TestUser;

  beforeAll(async () => {
    user1 = await createOryUser({
      email: 'admin1@test.it',
      password: 'p4s$worD!',
    });
    createOryAdminRelation({ userId: user1.id });

    user2 = await createOryUser({
      email: 'user1@test.it',
      password: 'p4s$worD!',
    });
  }, 15000);

  describe('POST /api/cat-profiles', () => {
    it('should create a cat profile', async () => {
      const res = await axios.post(
        `/api/cat-profiles`,
        {
          name: 'Godard',
          description: 'Black and white cat, knows how to open doors',
          age: 3,
        },
        axiosOptionsFactory(user1.sessionToken)
      );

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /api/cat-profiles/:id', () => {
    it('should update a cat profile when user is the owner', async () => {
      const cat = await createCatProfile({
        name: 'Romeo',
        description: 'Grey cat, loves to cuddle',
        age: 2,
        sessionToken: user1.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        { age: 3 },
        axiosOptionsFactory(user1.sessionToken)
      );

      expect(res.status).toBe(200);
    });

    it('should update a cat profile when user is an admin', async () => {
      const cat = await createCatProfile({
        name: 'Juliet',
        description: 'White cat, loves to play',
        age: 1,
        sessionToken: user2.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        { age: 2 },
        axiosOptionsFactory(user1.sessionToken)
      );

      expect(res.status).toBe(200);
    });

    it(`should return 403 if the user is not an admin or the cat profile's owner`, async () => {
      const cat = await createCatProfile({
        name: 'Crousti',
        description: 'Tabby brown, with a diva attitude',
        age: 8,
        sessionToken: user1.sessionToken,
      });

      const res = await axios.patch(
        `/api/cat-profiles/${cat.id}`,
        { age: 9 },
        axiosOptionsFactory(user2.sessionToken)
      );

      expect(res.status).toBe(403);
    });
  });
});
