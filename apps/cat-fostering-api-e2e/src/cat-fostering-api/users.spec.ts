import axios from 'axios';

import { createOryUser, TestUser } from './helpers';

describe('E2E Users API tests', () => {
  let user1: TestUser;

  beforeAll(async () => {
    user1 = await createOryUser({
      email: 'test@test.it',
      password: 'p4s$worD!',
    });
  }, 8000);

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
});
