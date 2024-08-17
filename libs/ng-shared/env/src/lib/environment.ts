import { Environment } from './environment.interface';

declare const process: {
  env: {
    CAT_FOSTERING_API_URL?: string;
    ORY_KRATOS_PUBLIC_URL?: string;
    NODE_ENV: 'production' | 'development' | 'test' | 'ci';
  };
};

export const environment: Environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl: process.env.CAT_FOSTERING_API_URL ?? 'http://127.0.0.1:3000',
  kratosUrl: process.env.ORY_KRATOS_PUBLIC_URL ?? 'http://127.0.0.1:4433',
};
