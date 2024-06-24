import { relationTupleBuilder } from '@getlarge/keto-relations-parser';
import axios, { AxiosRequestConfig } from 'axios';
import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';

export type TestUser = {
  email: string;
  id: string;
  sessionToken: string;
};

const execAsync = promisify(exec);

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  session: string;
  token: string;
  identity: string;
}> => {
  const { stdout, stderr } = await execAsync(
    `npx @getlarge/kratos-cli login --email '${email}' --password '${password}'`
  );
  if (stderr) {
    throw new Error(stderr.toString());
  }
  return JSON.parse(stdout.toString().trim());
};

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<void> => {
  const { stderr } = await execAsync(
    `npx @getlarge/kratos-cli register --email '${email}' --password '${password}'`
  );
  if (stderr) {
    throw new Error(stderr.toString());
  }
};

export const getCurrentUser = async ({
  sessionToken,
}: {
  sessionToken: string;
}): Promise<string> => {
  const res = await axios.get('api/users/current-user', {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  expect(res.status).toBe(200);
  return res.data.id;
};

export const createOryUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<TestUser> => {
  const user = {
    email,
    sessionToken: '',
    id: '',
  };
  await register({
    email,
    password,
  });
  user.sessionToken = await login({ email, password }).then((res) => res.token);
  user.id = await getCurrentUser({ sessionToken: user.sessionToken });
  return user;
};

export const createOryAdminRelation = ({
  userId,
}: {
  userId: string;
}): void => {
  const relationTuple = relationTupleBuilder()
    .subject('User', userId)
    .isIn('members')
    .of('Group', 'admin')
    .toString();

  execSync(`npx @getlarge/keto-cli create --tuple '${relationTuple}'`);
};

export const createCatProfile = async ({
  name,
  description,
  age,
  sessionToken,
}: {
  name: string;
  description: string;
  age: number;
  sessionToken: string;
}): Promise<{
  name: string;
  description: string;
  age: number;
  id: string;
}> => {
  const res = await axios.post(
    'api/cat-profiles',
    {
      name,
      description,
      age,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  expect(res.status).toBe(201);
  return res.data;
};

export const createFosteringRequest = async ({
  catProfileId,
  startDate,
  endDate,
  sessionToken,
}: {
  catProfileId: string;
  startDate: Date;
  endDate: Date;
  sessionToken: string;
}): Promise<{
  startDate: Date;
  endDate: Date;
  id: string;
}> => {
  const res = await axios.post(
    'api/fostering',
    {
      catProfileId,
      startDate,
      endDate,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  expect(res.status).toBe(201);
  return res.data;
};

export const axiosOptionsFactory = (
  sessionToken: string
): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${sessionToken}`,
  },
});
