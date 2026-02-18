const Event = require('../models/Event');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find events where the user is registered
        // AND the event date is in the future
        const events = await Event.find({
            registeredUsers: userId,
            date: { $gte: new Date() }
        }).sort({ date: 1 });

        const notifications = events.map(event => {
            const timeDiff = new Date(event.date) - new Date();
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            // Logic for "Upcoming" vs "Impending" vs "Future"
            // For now, let's just return all future registered events as "Upcoming"
            // We can add flags like isUrgent if it's within 24 hours

            return {
                _id: event._id,
                title: `Upcoming Event: ${event.title}`,
                message: `You have an upcoming event "${event.title}" on ${new Date(event.date).toLocaleDateString()}.`,
                date: event.date,
                isUrgent: hoursDiff <= 24,
                link: `/events/${event._id}`
            };
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
