// demo/app/components/navbar.js
import Ember from 'ember';
import { inject as service } from '@ember/service';
export default Ember.Component.extend({
  contactCount: service('contactcount'),
  classNames: ['sidebar', 'bg-dark', 'd-flex', 'flex-column', 'shadow', 'position-fixed', 'top-0', 'start-0', 'h-100'],
  navlinks: null,
  init() {
    this._super(...arguments);
    this.set('navlinks', [
      { 
        label: "Home", 
        route: "index", 
        icon: "🏠",
      },
      { 
        label: "Dashboard", 
        route: "dashboard", 
        icon: "📊",
      },
      {
        label: "Contacts",
        route: "contacts",
        icon: "👥",
        params: { dir: "asc", filter: "all", page: 1, sort: "name", per_page: 20 },
        sublinks: [
          {label: "New Contact", route: "new",icon: "➕"},
          { label: "Active Contacts", route: "contacts", params: { filter: "active" } ,icon : "✅"},
          { label: "Inactive Contacts", route: "contacts", params: { filter: "inactive" } , icon : "⛔" },
        ]
      }

    ]);
  },
});