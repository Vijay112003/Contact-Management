import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  name: attr('string'),
  email: attr('string'),
  phone: attr('string'),
  address: attr('string'),
  status: attr('string', { defaultValue: "active" }),

  serialize() {
    return {
      name: this.get('name'),
      email: this.get('email'),
      phone: this.get('phone'),
      address: this.get('address'),
      status: this.get('status')
    };
  },

  // validate() {
  //   alert('Validating contact...');
  //   const errors = {};
  //   if (!this.get('name') || this.get('name').trim() === '') {
  //     errors.name = 'Name is required';
  //   }
  //   if (!this.get('email') || !/^[^@]+@[^@]+\.[^@]+$/.test(this.get('email'))) {
  //     errors.email = 'Valid email is required';
  //   }
  //   if (!this.get('phone') || !/^\d{10}$/.test(this.get('phone'))) {
  //     errors.phone = 'Phone number required and must be 10 digits';
  //   }
  //   if (!this.get('address') || this.get('address').trim() === '') {
  //     errors.address = 'Address is required';
  //   }
    
  //   return Object.keys(errors).length ? errors : null;
  // }
});
