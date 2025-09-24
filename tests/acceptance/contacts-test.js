//demo/tests/acceptance/contacts-test.js
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | users', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /contacts', async function (assert) {
    this.server.createList('contact', 5);
    await visit('/contacts');
    assert.equal(currentURL(), '/contacts');
  });
});