// demo/mirage/factories/contact.js
import { Factory } from 'ember-cli-mirage';
export default Factory.extend({
  id(i) {
    const prefixes = ['9', '8', '7', '6'];
    const prefix = prefixes[i % prefixes.length];
    return prefix + String(100000000 + i).slice(-9);
  },
  name(i) {
    const firstNames = ['Vijay', 'Arun', 'Priya', 'Anita', 'Kumar', 'Sonia', 'Ravi', 'Meena'];
    const lastNames = ['Sarathi', 'Sharma', 'Kumar', 'Patel', 'Reddy', 'Iyer', 'Singh', 'Das'];
    return `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
  },
  email(i) {
    const domains = ['example.com', 'demo.com', 'mail.com', 'test.com'];
    return `user${i + 1}@${domains[i % domains.length]}`;
  },
  phone(i) {
    const prefixes = ['9', '8', '7', '6'];
    const prefix = prefixes[i % prefixes.length];
    return prefix + String(100000000 + i).slice(-9);
  },
  address(i) {
    const streets = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '101 Maple Blvd'];
    const cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi'];
    return `${streets[i % streets.length]}, ${cities[i % cities.length]}, India`;
  },
  status(){
    return "active";
  }
});