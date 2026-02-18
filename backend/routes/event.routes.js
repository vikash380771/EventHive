const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.post('/:id/register', protect, registerForEvent);

module.exports = router;
