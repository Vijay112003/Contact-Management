//demo/tests/integration/components/custom-button-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | custom-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<CustomButton @text="Click" @color="success" @onClick="" />`);
    assert.equal(this.element.textContent.trim(), '');

    await render(hbs
      `<CustomButton @text="Click" @color="success" @onClick={{this.handleClick}}>Click Me</CustomButton>`);
    assert.equal(this.element.textContent.trim(), 'Click Me');
  });
});