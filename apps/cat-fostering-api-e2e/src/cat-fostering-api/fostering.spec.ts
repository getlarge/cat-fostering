import { Fostering } from '@cat-fostering/entities';
import axios from 'axios';

import {
  axiosOptionsFactory,
  createCatProfile,
  createFosteringRequest,
  createOryUser,
  getFosteringRequest,
  TestUser,
} from './helpers';

describe('E2E Fostering Requests API tests', () => {
  let user1: TestUser;
  let user2: TestUser;
  let user3: TestUser;

  beforeAll(async () => {
    user1 = await createOryUser({
      email: 'guardian@test.it',
      password: 'p4s$worD!',
    });

    user2 = await createOryUser({
      email: 'participant@test.it',
      password: 'p4s$worD!',
    });

    user3 = await createOryUser({
      email: 'nobody@test.it',
      password: 'p4s$worD!',
    });
  }, 20000);

  describe('POST /api/fostering', () => {
    it('should create a fostering request', async () => {
      const catProfile = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      const res = await axios.post(
        `/api/fostering`,
        {
          startDate: new Date(),
          endDate: new Date(),
          catProfileId: catProfile.id,
        },
        axiosOptionsFactory(user2.sessionToken)
      );

      expect(res.status).toBe(201);
    });

    it(`should return 403 if the user is the cat profile owner`, async () => {
      const catProfile = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      const res = await axios.post(
        `/api/fostering`,
        {
          startDate: new Date(),
          endDate: new Date(),
          catProfileId: catProfile.id,
        },
        axiosOptionsFactory(user1.sessionToken)
      );

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/fostering', () => {
    it('user should only see her fostering requests', async () => {
      const catProfile1 = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      await createFosteringRequest({
        catProfileId: catProfile1.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });
      await createFosteringRequest({
        catProfileId: catProfile1.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user3.sessionToken,
      });

      const res = await axios.get<Fostering[]>(
        `/api/fostering`,
        axiosOptionsFactory(user2.sessionToken)
      );

      expect(res.status).toBe(200);
      const fosteringRequests = await Promise.all(
        res.data.map((f) =>
          getFosteringRequest({ id: f.id, sessionToken: user2.sessionToken })
        )
      );
      expect(
        fosteringRequests.every((r: Fostering) => r.participant.id === user2.id)
      ).toBeTruthy();
    });
  });

  describe('GET /api/fostering/:id', () => {
    it('should read the fostering request when user is the participant', async () => {
      const catProfile = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      const fosteringRequest = await createFosteringRequest({
        catProfileId: catProfile.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });

      const res = await axios.get(
        `/api/fostering/${fosteringRequest.id}`,
        axiosOptionsFactory(user2.sessionToken)
      );

      expect(res.status).toBe(200);
    });

    it('should read the fostering request when user is the catprofile owner', async () => {
      const catProfile = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      const fosteringRequest = await createFosteringRequest({
        catProfileId: catProfile.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });

      const res = await axios.get(
        `/api/fostering/${fosteringRequest.id}`,
        axiosOptionsFactory(user1.sessionToken)
      );
      expect(res.status).toBe(200);
    });

    it(`should return 403 if the user is not the participant or the catprofile owner`, async () => {
      const catProfile = await createCatProfile({
        name: 'Godard',
        description: 'Black and white cat, knows how to open doors',
        age: 3,
        sessionToken: user1.sessionToken,
      });
      const fosteringRequest = await createFosteringRequest({
        catProfileId: catProfile.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });

      const res = await axios.get(
        `/api/fostering/${fosteringRequest.id}`,
        axiosOptionsFactory(user3.sessionToken)
      );
      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/fostering/:id', () => {
    it.todo('should update a fostering request when user is the participant');

    it.todo(`should return 403 if the user is not the participant`);
  });

  describe('PATCH /api/fostering/:id/approve', () => {
    it('should approve a fostering request when user is the cat profile owner', async () => {
      const catProfile = await createCatProfile({
        name: 'Juliet',
        description: 'White cat, loves to play',
        age: 1,
        sessionToken: user1.sessionToken,
      });
      const fosteringRequest = await createFosteringRequest({
        catProfileId: catProfile.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });

      const res = await axios.patch(
        `/api/fostering/${fosteringRequest.id}/approve`,
        {},
        axiosOptionsFactory(user1.sessionToken)
      );

      expect(res.status).toBe(200);
    });

    it(`should return 403 if the user is not the cat profile owner`, async () => {
      const catProfile = await createCatProfile({
        name: 'Crousti',
        description: 'Tabby brown, with a diva attitude',
        age: 8,
        sessionToken: user1.sessionToken,
      });
      const fosteringRequest = await createFosteringRequest({
        catProfileId: catProfile.id,
        startDate: new Date(),
        endDate: new Date(),
        sessionToken: user2.sessionToken,
      });

      const res = await axios.patch(
        `/api/fostering/${fosteringRequest.id}/approve`,
        {},
        axiosOptionsFactory(user2.sessionToken)
      );

      expect(res.status).toBe(403);
    });
  });
});
