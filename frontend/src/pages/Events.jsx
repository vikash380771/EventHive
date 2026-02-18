import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Calendar, ArrowRight, Heart } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const Events = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialLocation = searchParams.get('location') || '';

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [location, setLocation] = useState(initialLocation);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, [initialSearch, initialLocation]); // Re-fetch if URL params change

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/events');
            // Client-side filtering for simplicity (ideal: backend filtering)
            const filtered = res.data.filter(event => {
                const matchTitle = event.title.toLowerCase().includes(initialSearch.toLowerCase());
                const matchLoc = event.location.toLowerCase().includes(initialLocation.toLowerCase());
                return matchTitle && matchLoc;
            });
            setEvents(filtered);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/events?search=${searchTerm}&location=${location}`);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Navigation */}
            <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-xl rounded-2xl">
                            E
                        </div>
                        <span className="text-2xl font-bold text-black tracking-tight">
                            EventHive
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">

                        <a href="/about" className="hover:text-black">About Us</a>
                        <a href="/organizer/dashboard" className="hover:text-black">Organize Event</a>
                        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-none px-4 py-2 border border-black focus-within:ring-1 focus-within:ring-black transition-all">
                            <Search className="w-4 h-4 text-black mr-2" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-transparent outline-none w-64 text-sm text-black placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <NotificationBell />
                                <div className="relative group">
                                    <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-black text-sm hidden md:block">{user.username}</span>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                        <div className="p-2">
                                            <p className="text-xs text-gray-500 px-3 py-2">Account Center</p>
                                            <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/login')} className="text-sm font-medium hover:text-black">Log In</button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold mb-6">
                    {initialSearch || initialLocation ? `Results for "${initialSearch}" in "${initialLocation}"` : 'All Events'}
                </h2>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No events found matching your criteria.</p>
                        <button onClick={() => { setSearchTerm(''); setLocation(''); navigate('/events'); }} className="mt-4 text-black font-bold hover:underline">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <div key={event._id} className="group bg-white border border-gray-200 hover:border-black transition-all cursor-pointer">
                                <div className="h-40 overflow-hidden relative" onClick={() => navigate(`/events/${event._id}`)}>
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                                        <Heart className="w-4 h-4 text-gray-400 hover:text-black transition-colors" />
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-white text-xs font-bold px-2 py-1 border border-gray-100 shadow-sm">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{event.title}</h3>
                                    <p className="text-black font-medium text-sm mb-2">
                                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-3 truncate">{event.location}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">{event.registeredUsers.length} interested</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/events/${event._id}`)}
                                        className="mt-4 w-full py-2 border border-black rounded-none text-sm font-bold hover:bg-black hover:text-white transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Events;
