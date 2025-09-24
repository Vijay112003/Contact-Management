// demo/app/services/contactcount.js
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const DEFAULT_PARAMS = {
  sort: 'name',
  dir: 'asc',
  filter: 'all',
  page: 1,
  per_page: 100000 // Increase per_page to fetch all contacts if possible
};

export default class ContactCountService extends Service {
  @service store;
  @tracked total = 0;
  @tracked active = 0;
  @tracked inactive = 0;
  async getCounts() {
    const data = await this.store.query('contact', { ...DEFAULT_PARAMS });
    const contacts = data.toArray();
    this.total = contacts.length;
    this.active = contacts.filter(c => c.status === 'active').length;
    this.inactive = contacts.filter(c => c.status === 'inactive').length;
  }
}
