//demo/app/routes/application.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
    contactCount: service('contactcount'),
    async beforeModel() {
        await this.contactCount.getCounts();
    }
});