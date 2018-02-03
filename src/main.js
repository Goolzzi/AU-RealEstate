import environment from './environment';

//Configure Bluebird Promises.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-google-maps', config => {
      config.options({
        apiKey: 'AIzaSyBUTbBmV57ZxYULwWqbBz-S2vGFfrHknKk',
        apiLibraries: 'drawing,geometry', //get optional libraries like drawing, geometry, ... - comma seperated list
        options: { panControl: true, panControlOptions: { position: 9 } },
        language: '' | 'en',
        region: '' | 'US'
      });
    })
    .plugin('resources/value-converters/converters');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
