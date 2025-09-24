// demo/app/router.js
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard');
  this.route('contacts', function() {
    this.route('details', { path: '/:contact_id' });
  });
  this.route('new');
});

export default Router;
