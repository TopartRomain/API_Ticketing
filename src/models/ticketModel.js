// Ticket model — adapt to your ORM/ODM
// Example with Mongoose:
//
// const mongoose = require('mongoose');
//
// const ticketSchema = new mongoose.Schema(
//   {
//     title:       { type: String, required: true },
//     description: { type: String },
//     status:      { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
//     priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
//   },
//   { timestamps: true }
// );
//
// module.exports = mongoose.model('Ticket', ticketSchema);
