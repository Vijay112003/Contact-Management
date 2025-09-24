// demo/app/controllers/contacts/details.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContactsDetailsController extends Controller {
  @service router;
  @service store;

  @tracked isEditing = false;
  @tracked hasUnsavedChanges = false;
  @tracked errorModel = null;
  @tracked hasError = false;
  @tracked isSettingActive = false;
  @tracked isSaving = false;
  @tracked contact = null;
  @tracked to = null;
  @tracked qps = null;

  get isNew() {
    return !this.model || !this.model.id;
  }

  @action
  closeErrorModal() {
    this.errorModel = null;
    this.hasError = false;
  }

  @action
  loadErrorModel(model) {
    this.errorModel = {
      title: model.message || 'Confirm Action',
      message: model.errors || 'Do you want to proceed?',
      code: model.code || 'CODE_NOT_SET',
      status: model.status || "CODE_NOT_SET",
      onConfirm: model.onConfirm || this.redirectErrorModel.bind(this),
      onCancel: model.onCancel || this.closeErrorModal.bind(this),
      primaryActionText: model.primaryActionText || 'OK',
    };
    let to = model.transition?.to?.name || 'contacts';
    let qps = model.transition?.to?.queryParams || { filter: 'all' };
    this.to = to;
    this.qps = qps;
    this.hasError = true;
  }

  @action
  redirectErrorModel() {
    this.errorModel = null;
    this.hasUnsavedChanges = false;
    this.hasError = false;
    this.isEditing = false;
    this.router.transitionTo(this.to, { queryParams: this.qps });
  }

  @action
  editContact() {
    this.isEditing = !this.isEditing;
  }

  @action
  deleteContact() {
    let contact = this.model;
    this.loadErrorModel({
      message: 'Confirm Delete',
      errors: `Are you sure you want to delete "${contact.name}"? This action cannot be undone.`,
      code: 'CONFIRM_DELETE',
      onConfirm: () => this.confirmDeleteContact(contact),
      onCancel: () => this.cancelDeleteContact(),
      status: null,
      primaryActionText: 'Delete'
    });
  }

  @action
  async confirmDeleteContact(contact) {
    this.hasError = false;
    this.isSaving = true;
    try {
      let res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        let data = await res.json().catch(() => ({}));
        throw new Error(data.errors || 'Unknown error');
      }

      let record = this.store.peekRecord('contact', contact.id);
      if (record) {
        record.unloadRecord();
      }

      this.contactCount.getCounts();
      this.router.transitionTo('contacts', { queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } });
    } catch (e) {
      this.loadErrorModel({
        message: 'Delete Failed',
        errors: e.message,
        code: 'DELETE_ERROR',
        transition: { to: { name: 'contacts', queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } } },
        status: null,
        primaryActionText: 'OK'
      });
    } finally {
      this.isSaving = false;
    }
  }

  @action
  cancelDeleteContact() {
    this.closeErrorModal();
  }

  @action
  closeDetails() {
    this.router.transitionTo('contacts');
  }

  @action
  async toggleActive(contact) {
    this.isSettingActive = true;
    try {
      let newStatus = contact.status === "active" ? "inactive" : "active";
      let res = await fetch(`/api/contacts/${contact.id}/${newStatus}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        let message = 'Unknown error';
        try {
          let data = await res.json();
          if (data.errors) message = data.errors;
        } catch {}
        this.errorModel = { title: 'Error', message: 'Error: ' + message };
        this.hasError = true;
      }
    } catch (e) {
      this.errorModel = {
        message: 'Error while toggling contact status.',
        errors: e.message || 'Unknown error',
        code: 'TOGGLE_STATUS_ERROR',
        transition: { to: { name: 'contacts', queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } } },
        status: null,
        primaryActionText: 'OK'
      };
      this.hasError = true;
    } finally {
      this.isSettingActive = false;
      this.contactCount.getCounts();
    }
  }

  @action
  async onEditForm(event) {
    event.preventDefault();

    if (!this.hasUnsavedChanges) {
      this.loadErrorModel({
        message: 'No Changes',
        errors: 'There are no changes to save.',
        code: 'NO_CHANGES',
        transition: { to: { name: 'contacts.details', queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } } },
        status: 400,
        primaryActionText: 'OK'
      });
      return;
    }

    this.isSaving = true;
    try {
      let contactData = { ...this.contact };

      let res = await fetch('/api/contacts/' + (contactData.id || ''), {
        method: contactData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (!res.ok) {
        let message = 'Unknown error';
        try {
          let data = await res.json();
          if (data.errors) message = data.errors;
        } catch {}
        throw new Error(message);
      }

      let savedContact = await res.json();

      let contactRecord = this.store.peekRecord('contact', savedContact.contact.id);
      if (contactRecord) {
        contactRecord.setProperties(savedContact.contact);
      } else {
        this.store.push(this.store.normalize('contact', savedContact.contact));
      }

      this.hasUnsavedChanges = false;
      this.isEditing = false;
      this.router.transitionTo('contacts.details', savedContact.contact.id);

    } catch (e) {
      this.loadErrorModel({
        message: 'Failed to save contact',
        errors: e.message,
        code: 'SAVE_ERROR',
        transition: { to: { name: 'contacts', queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } } },
        status: null,
        primaryActionText: 'OK'
      });
    } finally {
      this.isSaving = false;
    }
  }

  @action
  onCloseForm() {
    if (this.hasUnsavedChanges) {
      this.loadErrorModel({
        message: 'Unsaved Changes',
        errors: 'You have unsaved changes. Do you want to discard them?',
        code: 'UNSAVED_CHANGES',
        transition: { to: { name: 'contacts', queryParams: { filter: 'all', sort: 'name', dir: "asc", page: 1, per_page: 20 } } },
        status: null,
        primaryActionText: 'Discard Changes',
      });
    } else {
      this.hasUnsavedChanges = false;
      this.isEditing = false;
      this.hasError = false;
      this.router.transitionTo('contacts.details', this.model.id);
    }
  }

  @action
  updateField(field, event) {
    this.contact = { ...this.contact, [field]: event.target.value };
    this.hasUnsavedChanges = true;
  }
}
