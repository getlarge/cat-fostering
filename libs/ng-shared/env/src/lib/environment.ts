export interface Environment {
  production: boolean;
  apiUrl: string;
  kratosUrl: string;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:3000',
  kratosUrl: 'http://127.0.0.1:4433',
};
