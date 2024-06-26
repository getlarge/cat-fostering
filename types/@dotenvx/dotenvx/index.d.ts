declare module '@dotenvx/dotenvx' {
  type DotenvxConfig = {
    DOTENV_KEY?: string;
    overload?: boolean;
    override?: boolean;
    convention?: boolean;
    path?: string;
    processEnv?: Record<string, string>;
  };

  type DotenvxResult = {
    parsed: Record<string, string>;
    error?: Error & { message?: string; code?: string; help?: string };
  };

  export function config(options?: DotenvxConfig): DotenvxResult;
}
