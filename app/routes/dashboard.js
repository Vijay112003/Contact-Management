//demo/app/routes/dashboard.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
    contactCount: service('contactcount'),
    async model() {
        let count = await this.contactCount;
        count.getCounts();
        return count;
    }
});