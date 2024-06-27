// src/app/state/user.state.ts
import { endWith, Observable, startWith } from 'rxjs';

export type DefaultLoadingProp = string & 'loading';
export type LoadingState<
  K extends string | DefaultLoadingProp = DefaultLoadingProp
> = {
  [k in K]?: boolean;
};
export type WithContext<T> = LoadingState & {
  value: T;
  error?: unknown;
  complete?: unknown;
};

const defaultLoadingProp: DefaultLoadingProp = 'loading';

export function withLoadingEmission<T, K extends string = DefaultLoadingProp>(
  property?: K
) {
  const _property =
    property === undefined
      ? (defaultLoadingProp as DefaultLoadingProp)
      : property;

  const start = { [_property]: true } as T & LoadingState<K>;
  const end = { [_property]: false } as T & LoadingState<K>;

  return (o$: Observable<T>) =>
    (o$ as Observable<T & LoadingState<K>>).pipe(
      startWith(start),
      endWith(end)
    );
}
