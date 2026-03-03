// Placeholder in-memory store — replace with DB queries
let tickets = [];
let nextId = 1;

const findAll = () => tickets;

const findById = (id) => tickets.find((t) => t.id === parseInt(id));

const create = (data) => {
  const ticket = { id: nextId++, ...data, createdAt: new Date() };
  tickets.push(ticket);
  return ticket;
};

const update = (id, data) => {
  const index = tickets.findIndex((t) => t.id === parseInt(id));
  if (index === -1) return null;
  tickets[index] = { ...tickets[index], ...data };
  return tickets[index];
};

const remove = (id) => {
  const index = tickets.findIndex((t) => t.id === parseInt(id));
  if (index === -1) return null;
  const deleted = tickets.splice(index, 1);
  return deleted[0];
};

module.exports = { findAll, findById, create, update, remove };
