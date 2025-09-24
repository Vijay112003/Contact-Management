// demo/app/routes/contacts.js
import Route from '@ember/routing/route';
export default class ContactsRoute extends Route {
  queryParams = {
    page: { refreshModel: true },
    per_page: { refreshModel: true },
    sort: { refreshModel: true },
    dir: { refreshModel: true },
    filter: { refreshModel: true }
  };
  async model(params) {
    const contacts =await this.store.query('contact', params);
    return contacts;
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    if (model && model.meta) {
      controller.updateMeta(model.meta);
    }
  }
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.selectedContact = null;
      controller.page = 1;
      controller.per_page = 20;
      controller.sort = 'name';
      controller.dir = 'asc';
      controller.filter = 'all';
    }
  }
}