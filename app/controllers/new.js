import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NewController extends Controller {
  @service router;

  @tracked hasError = false;
  @tracked errorModel = null;
  @tracked hasUnsavedChanges = false;
  @tracked contact = null;
  @tracked isSaving = false;
  @tracked isNew = true;
  @tracked to = null;
  @tracked qps = null;
  @tracked validationErrors = {};

  constructor() {
    super(...arguments);
    if (!this.contact) {
      this.contact = { name: '', email: '', phone: '', address: '', status: 'active' };
    }
  }

  loadErrorModel(model) {
    this.errorModel = {
      title: model.message || 'Unsaved Changes',
      message: model.errors || 'You have unsaved changes. Do you want to discard them?',
      code: model.code || 'UNSAVED_CHANGES',
      status: model.status || null,
      onConfirm: model.onConfirm || this.redirectErrorModel.bind(this),
      onCancel: model.onCancel || this.closeErrorModal.bind(this),
      primaryActionText: model.primaryActionText || 'OK',
    };
    this.to = model.transition?.to?.name || 'contacts';
    this.qps = model.transition?.to?.queryParams || { filter: "all", sort: "name", page: 1, per_page: 20, dir: "asc" };
    this.hasError = true;
  }

  @action
  closeErrorModal() {
    this.hasError = false;
    this.errorModel = null;
  }

  @action
  redirectErrorModel() {
    this.hasUnsavedChanges = false;
    this.hasError = false;
    this.errorModel = null;
    this.contact = null;
    this.router.transitionTo(this.to, { queryParams: this.qps });
  }

  @action
  async onSaveForm(event) {
    event.preventDefault();

    // Run validation
    const errors = this.validateContact(this.contact);
    if (errors) {
      this.validationErrors = errors;
      return;
    } else {
      this.validationErrors = {};
    }

    if (!this.hasUnsavedChanges) {
      this.loadErrorModel({
        message: 'No Changes',
        errors: 'There are no Data to save. Go to Contacts List ?',
        code: 'NO_CHANGES',
        transition: { to: { name: 'contacts', queryParams: { filter: "all", sort: "name", page: 1, per_page: 20, dir: "asc" } } },
        status: 400
      });
      return;
    }

    this.isSaving = true;
    this.contact.status = "active";
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.contact)
      });
      if (!res.ok) {
        throw new Error(`Failed to save contact: ${res.statusText}`);
      }
      this.hasUnsavedChanges = false;
      this.hasError = false;
      this.contact = {};
      this.router.transitionTo('contacts');
    } catch (e) {
      this.loadErrorModel({
        message: 'Failed to save contact',
        errors: e.message,
        code: 'SAVE_ERROR',
        transition: { to: { name: 'contacts', queryParams: { filter: "all", sort: "name", page: 1, per_page: 20, dir: "asc" } } },
        status: null
      });
    } finally {
      this.isSaving = false;
      this.contactCount.getCounts();
    }
  }

  validateContact(contact) {
    const errors = {};
    if (!contact.name || contact.name.trim() === '') {
      errors.name = 'Name is required';
    }
    if (!contact.email || !/^[^@]+@[^@]+\.[^@]+$/.test(contact.email)) {
      errors.email = 'Valid email is required';
    }
    if (!contact.phone || !/^\d{10}$/.test(contact.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    if (!contact.address || contact.address.trim() === '') {
      errors.address = 'Address is required';
    }
    return Object.keys(errors).length ? errors : null;
  }

  @action
  onCloseForm() {
    if (this.hasUnsavedChanges) {
      this.loadErrorModel({
        message: 'Unsaved Changes',
        errors: 'You have unsaved changes. Do you want to discard them?',
        code: 'UNSAVED_CHANGES',
        transition: { to: { name: 'contacts', queryParams: { filter: "all", sort: "name", page: 1, per_page: 20, dir: "asc" } } },
        status: null
      });
    } else {
      this.router.transitionTo('contacts');
    }
  }

  @action
  updateField(field, event) {
    this.contact = { ...this.contact, [field]: event.target.value };
    this.hasUnsavedChanges = true;
  }
}
