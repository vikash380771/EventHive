const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity']
    },
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/800x400'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
