const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'username');
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'username');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, capacity, imageUrl } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            capacity,
            imageUrl,
            organizer: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer)
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this event' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();

        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (User)
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        if (event.registeredUsers.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // Check capacity
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.registeredUsers.push(req.user.id);
        await event.save();

        // Emit socket event for real-time updates
        const io = req.app.get('socketio');
        if (io) {
            io.emit('updateRegistrations', {
                eventId: event._id,
                count: event.registeredUsers.length
            });
        }

        res.json({ message: 'Registration successful', count: event.registeredUsers.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
