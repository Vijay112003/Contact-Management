import { startMirage } from 'demo/initializers/ember-cli-mirage';

export default function(hooks) {
  hooks.beforeEach(function() {
    startMirage();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });
}
