import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import io from 'socket.io-client';
import { Plus, Trash2, Calendar, MapPin, Users, LogOut, BarChart3, Search } from 'lucide-react';

const OrganizerDashboard = () => {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', location: '', category: '', capacity: '', imageUrl: ''
    });

    useEffect(() => {
        const socket = io('http://localhost:5000');
        fetchEvents();

        socket.on('updateRegistrations', ({ eventId, count }) => {
            setEvents(prev => prev.map(e => e._id === eventId ? { ...e, registeredUsers: Array(count).fill(null) } : e));
        });

        return () => socket.disconnect();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/events');
            // Filter events created by this organizer
            // Ensure we handle both populated object and ID string for organizer
            const myEvents = res.data.filter(event => {
                const organizerId = event.organizer?._id || event.organizer;
                return organizerId === user._id;
            });
            setEvents(myEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/events', newEvent);
            setShowCreateModal(false);
            setNewEvent({ title: '', description: '', date: '', location: '', category: '', capacity: '', imageUrl: '' });
            fetchEvents();
            alert('Event Created Successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await axios.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <header className="bg-white border-b border-black sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl">
                            EO
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">
                                Organizer<span>Panel</span>
                            </h1>
                            <p className="text-xs text-gray-500">Managing {events.length} events</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-black">{user.username}</p>
                                <p className="text-xs text-gray-500">Organizer</p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors mr-2"
                                title="Exit Dashboard"
                            >
                                <span className="text-sm font-bold">Exit</span>
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Dashboard Overview</h2>
                        <p className="text-gray-500 mt-1">Manage your events and track performance.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-none font-bold hover:bg-gray-800 transition-all"
                    >
                        <Plus size={20} /> Create New Event
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="Search events by title or location..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-black rounded-none focus:ring-1 focus:ring-black outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 border border-gray-200 hover:border-black transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 text-black rounded-none">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Events</p>
                                <p className="text-2xl font-bold">{events.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 hover:border-black transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 text-black rounded-none">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Attendees</p>
                                <p className="text-2xl font-bold">{events.reduce((acc, curr) => acc + curr.registeredUsers.length, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 hover:border-black transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 text-black rounded-none">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Avg. Occupancy</p>
                                <p className="text-2xl font-bold">
                                    {events.length > 0
                                        ? Math.round((events.reduce((acc, curr) => acc + (curr.registeredUsers.length / curr.capacity), 0) / events.length) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event._id} className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden">
                                <div className="relative h-48">
                                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                                        <button
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="p-2 bg-white text-black border border-black rounded-none hover:bg-black hover:text-white transition-all shadow-sm"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800"></div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                                        <h3 className="text-white font-bold text-lg line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-300 text-sm flex items-center gap-1">
                                            <MapPin size={12} /> {event.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-black border border-gray-300">
                                            {event.category}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-700">Attendees</span>
                                            <span className="text-black">{event.registeredUsers.length} / {event.capacity}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 overflow-hidden">
                                            <div
                                                className="bg-black h-2"
                                                style={{ width: `${Math.min((event.registeredUsers.length / event.capacity) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredEvents.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">No events found</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first event.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-none font-medium transition-colors"
                        >
                            Create Event
                        </button>
                    </div>
                )}

                {/* Create Event Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-black">Create New Event</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-black">
                                    <Plus className="rotate-45" size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateEvent} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Event Title</label>
                                    <input type="text" required className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Summer Music Festival" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Date</label>
                                        <input type="date" required className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Time</label>
                                        <input type="time" className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="text" required className="w-full pl-10 pr-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="e.g. Central Park, NY" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Description</label>
                                    <textarea required className="w-full px-4 py-2 bg-white border border-black h-32 focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                                        value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Tell people what your event is about..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Category</label>
                                        <select required className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                                            <option value="">Select Category</option>
                                            <option value="Music">Music</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Art">Art</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Food">Food</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Capacity</label>
                                        <input type="number" required min="1" className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Image URL</label>
                                    <input type="url" className="w-full px-4 py-2 bg-white border border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        value={newEvent.imageUrl} onChange={e => setNewEvent({ ...newEvent, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-black hover:bg-gray-100 rounded-none font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-none font-bold shadow-lg transition-all">Create Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrganizerDashboard;
