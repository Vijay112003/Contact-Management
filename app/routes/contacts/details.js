import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  router: service(),
  store: service(),
  contactCount: service('contactcount'),

  async model(params) {
    try {
      let contact = await this.store.findRecord('contact', params.contact_id);
      return contact;
    } catch (error) {
      return { message: 'Contact not found.', code: 404, status: null };
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set("contactCount", this.contactCount);
    let parentController = this.controllerFor('contacts');
    parentController.selectedContact = model;

    // ✅ ensures no circular refs
    controller.contact = typeof model.toJSON === 'function' 
      ? model.toJSON({ includeId: true }) 
      : { ...model };
  },


  renderTemplate(controller, model) {
    if (model.code === 404) {
      controller.loadErrorModel({...model,transition: { to: 'contacts' ,queryParams: {
        sort: this.controllerFor('contacts').sort,
        dir: this.controllerFor('contacts').dir,
        filter: this.controllerFor('contacts').filter,
        page: this.controllerFor('contacts').page,
        per_page: this.controllerFor('contacts').per_page
      }}});
    }

    this.render('contacts/details', {
      outlet: 'details',
      into: 'contacts',
      controller,
      model
    });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.errorModel = null;
      controller.hasError = false;
    }
  },

  actions:{
    willTransition(transition) {
      let controller = this.controller;
      if (controller.get('hasUnsavedChanges')) {
        transition.abort();
        controller.loadErrorModel({ transition });
      }
    }
  }
});
