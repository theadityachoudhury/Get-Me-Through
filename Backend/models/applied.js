const mongoose = require('mongoose');

// Create a schema for the person who applied to an event
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the User model
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events', // Reference to the Event model
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create a model for the application schema
const Application = mongoose.model('applied', applicationSchema);

module.exports = Application;

