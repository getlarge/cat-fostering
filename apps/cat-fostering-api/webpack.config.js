const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/cat-fostering-api'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      transformers: [
        {
          name: '@nestjs/swagger/plugin',
          options: {
            classValidatorShim: true,
            dtoFileNameSuffix: ['-entities.ts', '.dto.ts'],
            controllerFileNameSuffix: ['.controller.ts'],
            dtoKeyOfComment: 'description',
            controllerKeyOfComment: 'description',
            introspectComments: true,
          },
        },
      ],
    }),
  ],
  // not working, why?
  // watchOptions: {
  //   ignored: ['**/openapi.json'],
  // },
};
