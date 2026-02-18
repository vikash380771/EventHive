import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, Share2, Heart, ArrowLeft, Users, Ticket } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [localRegisteredCount, setLocalRegisteredCount] = useState(0);

    useEffect(() => {
        fetchEvent();

        // Socket connection for real-time updates
        const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));
        socket.on('updateRegistrations', ({ eventId, count }) => {
            if (eventId === id) {
                setLocalRegisteredCount(count);
            }
        });

        return () => socket.disconnect();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`/events/${id}`);
            setEvent(res.data);
            setLocalRegisteredCount(res.data.registeredUsers.length);
        } catch (error) {
            console.error('Error fetching event:', error);
            // navigate('/events'); // Redirect if not found
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setIsCheckoutOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    );

    if (!event) return null;

    const remainingTickets = event.capacity - localRegisteredCount;
    const isSoldOut = remainingTickets <= 0;

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
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
                        <a href="/events" className="hover:text-black">Find Events</a>
                        <a href="/organizer/dashboard" className="hover:text-black">Organize Event</a>
                        <a href="/about" className="hover:text-black">About Us</a>

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

            <main className="pt-16">
                {/* Hero Image */}
                <div className="relative h-[400px] w-full bg-gray-100">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover mix-blend-overlay opacity-50 grayscale"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                    )}

                    {/* Floating Card Content */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-none shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-white">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full md:w-64 h-48 object-cover shadow-lg grayscale"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            ) : (
                                <div className="w-full md:w-64 h-48 bg-gray-200 shadow-lg"></div>
                            )}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-white text-black rounded-none text-xs font-bold uppercase tracking-wide">
                                    {event.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black leading-tight">{event.title}</h1>
                                <p className="text-lg opacity-90 font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                <p className="opacity-80 flex items-center justify-center md:justify-start gap-2">
                                    <MapPin size={18} /> {event.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Description & Details */}
                    <div className="lg:w-2/3 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>



                        {/* Stats Section */}
                        <div className="p-6 bg-white rounded-none border border-black">
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                                <Users size={20} /> Event Stats
                            </h3>
                            <div className="grid grid-cols-2 text-center">
                                <div className="border-r border-gray-200">
                                    <p className="text-3xl font-black text-black">{localRegisteredCount}</p>
                                    <p className="text-xs uppercase font-bold text-gray-500 tracking-wide mt-1">registered</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-black">{remainingTickets}</p>
                                    <p className="text-xs uppercase font-bold text-gray-500 tracking-wide mt-1">ticket remaining</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Ticket Card */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-none p-6 shadow-xl">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Price</p>
                                    <p className="text-3xl font-black">Free</p>
                                </div>

                                <button
                                    onClick={handleReserve}
                                    disabled={isSoldOut}
                                    className={`w-full py-4 rounded-none font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 block text-center ${isSoldOut
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-black hover:bg-gray-800 text-white shadow-gray-500/30'
                                        }`}
                                >
                                    {isSoldOut ? 'Sold Out' : 'Reserve a spot'}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    No refund policy.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <Heart size={20} />
                                </button>
                                <button className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                event={event}
                onRegisterSuccess={() => {
                    fetchEvent(); // Refresh stats
                }}
            />
        </div>
    );
};

export default EventDetails;

