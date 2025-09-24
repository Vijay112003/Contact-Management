import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | contacts/details', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /contacts/details', async function(assert) {
    await visit('/contacts/details');
    assert.equal(currentURL(), '/contacts/details');
  });
});