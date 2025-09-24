import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  contactCount : service('contactcount'),
  model() {
    return { isNew: true };
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("contactCount", this.contactCount);

    // Warn on browser reload
    window.onbeforeunload = function() {
      if (controller.get('hasUnsavedChanges')) {
        return "You have unsaved changes. Do you really want to leave?";
      }
    };
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      window.onbeforeunload = null;
    }
  },

  actions: {
    willTransition(transition) {
      let controller = this.controller;
      if (controller.get('hasUnsavedChanges')) {
        transition.abort();
        controller.loadErrorModel({ transition });
      }
    }
  }
});