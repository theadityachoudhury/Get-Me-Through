const mongoose = require('mongoose');

// Define the Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'past', 'canceled'],
      default: 'upcoming',
    },
    applied: {
      type: Number,
      default: 0
    },
    tags: [String],
  },
  {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
  }
);

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
