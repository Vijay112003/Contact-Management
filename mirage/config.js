import { createServer, Response } from 'miragejs';

export default function (config) {
  return createServer({
    ...config,

    routes() {
      this.namespace = '/api';

      // GET /contacts?page=X&per_page=Y
      this.get('/contacts', function (schema, request) {
        let page = Number(request.queryParams.page) || 1;
        let perPage = Number(request.queryParams.per_page) || 20;
        let filter = request.queryParams.filter || 'all';
        let dir = request.queryParams.dir || 'asc';
        let sort = request.queryParams.sort || 'name';

        let all = schema.contacts.all().models.sort((a, b) => {
          let fieldA = a[sort];
          let fieldB = b[sort];
          if (typeof fieldA === 'string') {
            fieldA = fieldA.toLowerCase();
            fieldB = fieldB.toLowerCase();
          }
          if (fieldA < fieldB) return dir === 'asc' ? -1 : 1;
          if (fieldA > fieldB) return dir === 'asc' ? 1 : -1;
          return 0;
        });

        if (filter !== 'all') {
          if (filter === 'active') {
            all = all.filter(c => c.status === "active");
          } else if (filter === 'inactive') {
            all = all.filter(c => c.status === "inactive");
          }
        }
        let total = all.length;
        let start = (page - 1) * perPage;
        let paged = all.slice(start, start + perPage);

        return {
          contacts: this.serialize(paged).contacts || this.serialize(paged),
          meta: {
            data_per_page: perPage,
            page: page,
            total: total
          }
        };
      },{timing: 0});

      // GET /contacts/:id
      this.get('/contacts/:id', function (schema, request) {
        let id = request.params.id;
        let contact = schema.contacts.find(id);

        if (!contact) {
          return new Response(404, {}, { errors: ['Contact not found'] });
        }

        return this.serialize(contact);
      }, { timing: 1000 });

      // POST /contacts
      this.post('/contacts', function (schema, request) {
        let attrs = JSON.parse(request.requestBody);

        if (!attrs.id) {
          if (attrs.phone) {
            attrs.id = String(attrs.phone).replace(/\D/g, '').slice(0, 10);
          } else {
            attrs.id = String(Math.floor(1000000000 + Math.random() * 9000000000));
          }
        }

        let exists = schema.contacts.find(attrs.id);
        if (exists) {
          return new Response(201, {}, { contact: newContact.attrs });
        }

        let newContact = schema.contacts.create(attrs);

        return this.serialize(newContact);
      });

      // PATCH /contacts/:id and PUT /contacts/:id
      function updateContactHandler(schema, request) {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        let contact = schema.contacts.find(id);

        if (!contact) return new Response(404, {}, { errors: ['Contact not found'] });

        contact.update(attrs);
        return new Response(200, {}, { contact: contact.attrs });
      }

      this.put('/contacts/:id', updateContactHandler);
      this.patch('/contacts/:id', updateContactHandler);

      // DELETE /contacts/:id
      this.del('/contacts/:id', function (schema, request) {
        let id = request.params.id;
        let contact = schema.contacts.find(id);

        if (!contact) {
          return new Response(404, {}, { errors: ['Contact not found'] });
        }

        contact.destroy();
        return new Response(204);
      });

      // POST /contacts/:id/active
      this.post('/contacts/:id/active', function (schema, request) {
        let id = request.params.id;
        let contact = schema.contacts.find(id);

        if (!contact) {
          return new Response(404, {}, { errors: ['Contact not found'] });
        }

        if (contact.status === true || contact.status === "active") {
          return new Response(409, {}, { errors: ['Contact is already active'] });
        }

        contact.update({ status: "active" });
        return this.serialize(contact);
      });

      // POST /contacts/:id/inactive
      this.post('/contacts/:id/inactive', function (schema, request) {
        let id = request.params.id;
        let contact = schema.contacts.find(id);

        if (!contact) {
          return new Response(404, {}, { errors: ['Contact not found'] });
        }

        if (contact.status === false || contact.status === "inactive") {
          return new Response(409, {}, { errors: ['Contact is already inactive'] });
        }

        contact.update({ status: "inactive" });
        return this.serialize(contact);
      });
    }
  });
}
