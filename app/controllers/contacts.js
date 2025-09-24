// demo/app/controllers/contacts.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default class ContactsController extends Controller {
  owner = getOwner(this);
  @service router;

  @tracked selectedContact = null;
  @tracked totalPages = 1;
  @tracked meta = { total: 0, data_per_page: 20, page: 1 };

  queryParams = [
      { page: { type: 'number', defaultValue: null } },
      { per_page: { type: 'number', defaultValue: null } },
      { sort: { type: 'string', defaultValue: null } },
      { dir: { type: 'string', defaultValue: null } },
      { filter: { type: 'string', defaultValue: null } }
    ];

    @tracked page = 0;
    @tracked per_page = 0;
    @tracked sort = '';
    @tracked dir = '';
    @tracked filter = '';

    

  @action
  async selectContact(contact) {
    this.selectedContact = contact;
    // include current query params so URL is preserved
    this.router.transitionTo('contacts.details', contact.id, {
      queryParams: {
        page: this.page,
        per_page: this.per_page,
        sort: this.sort,
        dir: this.dir,
        filter: this.filter
      }
    });
  }

  @action
  createContact() {
    this.router.transitionTo('contacts.details', 'new', {
      queryParams: {
        page: this.page,
        per_page: this.per_page,
        sort: this.sort,
        dir: this.dir,
        filter: this.filter
      }
    });
  }

  @action
  updateMeta(meta) {
    this.meta = meta || this.meta;
    const perPage = this.meta.data_per_page || 20;
    const total = this.meta.total || 0;
    this.totalPages = Math.max(1, Math.ceil(total / perPage));
  }

  @action
  goToPage(p) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
    }
  }

  @action
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  @action
  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  @action
  updateSort(event) {
    // event from <select> change
    this.sort = event && event.target ? event.target.value : event;
  }

  @action
  updateDir(value) {
    this.dir = value;
  }

  @action
  updateFilter(value) {
    this.filter = value;
  }

  @action
  changePageInput(event) {
    let val = parseInt(event.target.value);
    if (!isNaN(val) && val >= 1 && val <= this.totalPages) {
      this.page = val;
    } else if (val < 1) {
      this.page = 1;
    } else if (val > this.totalPages) {
      this.page = this.totalPages;
    }
    event.target.value = this.page;
  }

  @action
  changePerPage(event) {
    let val = parseInt(event.target.value);
    if (!isNaN(val) && val > 0) {
      this.per_page = val;
      this.page = 1;
    }
  }
}