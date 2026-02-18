import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import io from 'socket.io-client';
import { Calendar, MapPin, Users, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        fetchEvents();

        newSocket.on('updateRegistrations', ({ eventId, count }) => {
            setEvents(prevEvents => prevEvents.map(event =>
                event._id === eventId ? { ...event, registeredUsers: Array(count).fill(null) } : event
            ));
        });

        return () => newSocket.disconnect();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await axios.post(`/events/${eventId}/register`);
            alert('Registration successful!');
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <div className="max-w-7xl mx-auto p-6">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-6 border-b border-black">
                    <div>
                        <h1 className="text-3xl font-bold text-black">
                            EventHive
                        </h1>
                        <p className="text-gray-500 mt-1">Welcome back, {user.username} 👋</p>
                    </div>
                    <div className="flex items-center gap-4">

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-gray-800 rounded-none font-medium transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <main>
                    <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
                        <Calendar className="text-black" /> Upcoming Events
                    </h2>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <div key={event._id} className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="px-3 py-1 text-xs font-bold text-black bg-white/90 backdrop-blur-md border border-black">
                                                {event.category}
                                            </span>
                                        </div>
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                                        />
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-semibold text-black">
                                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 text-black line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                            {event.description}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={16} className="mr-2 text-black" /> {event.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Users size={16} className="mr-2 text-black" />
                                                <span className="font-medium text-black mr-1">{event.registeredUsers.length}</span> / {event.capacity} registered
                                                {event.registeredUsers.length >= event.capacity && (
                                                    <span className="ml-2 text-xs text-black font-bold uppercase border border-black px-1">Sold Out</span>
                                                )}
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-black h-1.5 transition-all duration-500"
                                                    style={{ width: `${Math.min((event.registeredUsers.length / event.capacity) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRegister(event._id)}
                                            disabled={event.registeredUsers.includes(user._id) || event.registeredUsers.length >= event.capacity}
                                            className={`w-full py-3 px-4 font-bold text-sm transition-all transform active:scale-95 border ${event.registeredUsers.includes(user._id)
                                                ? 'bg-gray-100 text-gray-700 border-gray-300 cursor-default'
                                                : event.registeredUsers.length >= event.capacity
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'bg-black text-white border-black hover:bg-gray-800'
                                                }`}
                                        >
                                            {event.registeredUsers.includes(user._id)
                                                ? 'Registered'
                                                : event.registeredUsers.length >= event.capacity
                                                    ? 'Sold Out'
                                                    : 'Secure Your Spot'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {events.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white border border-dashed border-gray-300">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-black">No events found</h3>
                            <p className="text-gray-500">Check back later for new upcoming events.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
