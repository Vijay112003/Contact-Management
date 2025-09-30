//demo/app/controllers/index.js
import Controller from '@ember/controller';
export default Controller.extend({
    title: 'Contact Management',
    subtitle: 'This Application is used to manage contacts.',
    description: 'This is a demo application to showcase Ember.js features and best practices.',
    handleClick() {
        alert('Button clicked!');
    }
});