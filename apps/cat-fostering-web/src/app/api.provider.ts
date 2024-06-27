import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  Configuration,
  ConfigurationParameters,
} from '@cat-fostering/ng-data-acess';

export function withBackendApiConfiguration(
  configurationParameters: ConfigurationParameters = {}
): Configuration {
  return new Configuration({
    basePath: 'http://localhost:3000/api',
    ...configurationParameters,
  });
}

export function provideApi(
  withConfiguration: Configuration = withBackendApiConfiguration()
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: Configuration, useValue: withConfiguration },
  ]);
}
