import { useState } from 'react';
import { Search, MapPin, Calendar, ArrowRight, Music, Heart, Briefcase, Coffee, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const categories = [
        { name: 'Music', icon: <Music size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Nightlife', icon: <Ticket size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Arts', icon: <Heart size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Holidays', icon: <Calendar size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Dating', icon: <Heart size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Hobbies', icon: <Coffee size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Business', icon: <Briefcase size={20} />, color: 'bg-gray-100 text-black' },
        { name: 'Food', icon: <Coffee size={20} />, color: 'bg-gray-100 text-black' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        // Encoding URI components to handle spaces and special characters
        navigate(`/events?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-xl rounded-2xl shadow-lg">
                            E
                        </div>
                        <span className="text-2xl font-bold text-black tracking-tighter">
                            EventHive
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                        <button onClick={() => navigate('/events')} className="hover:text-black transition-colors">Find Events</button>
                        <button onClick={() => navigate('/organizer/dashboard')} className="hover:text-black transition-colors">Organize</button>
                        <button onClick={() => navigate('/about')} className="hover:text-black transition-colors">About</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <NotificationBell />
                                <div className="relative group">
                                    <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="font-bold text-black hidden md:block">{user.username}</span>
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="p-2">
                                            <p className="text-xs text-gray-500 px-3 py-2">Account Center</p>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} className="text-sm font-bold hover:text-gray-600 transition-colors">Log In</button>
                                <button onClick={() => navigate('/register')} className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-all hover:scale-105 active:scale-95">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 mb-24">
                    <h1 className="text-[10vw] md:text-[12vw] leading-[0.85] font-black tracking-tighter mb-8">
                        DISCOVER <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">EXPERIENCES</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed mb-10 font-light">
                        Curated events for the curious. Connect with communities and find your passion.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => navigate('/events')} className="px-10 py-4 bg-black text-white text-lg font-bold rounded-full hover:bg-gray-900 transition-all hover:-translate-y-1">
                            Browse Events
                        </button>
                        <button onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 border-2 border-gray-200 text-black text-lg font-bold rounded-full hover:border-black transition-all">
                            Search
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div id="search-section" className="max-w-7xl mx-auto px-6 mb-32">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-0 bg-gray-100 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                        <div className="relative bg-white border-2 border-black rounded-3xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl">
                            <div className="flex-1 flex items-center px-4 w-full h-16">
                                <Search className="text-black w-6 h-6 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full h-full bg-transparent outline-none text-xl font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block" />
                            <div className="flex-1 flex items-center px-4 w-full h-16">
                                <MapPin className="text-black w-6 h-6 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="w-full h-full bg-transparent outline-none text-xl font-medium"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="bg-black text-white w-full md:w-auto h-16 px-10 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors">
                                Find
                            </button>
                        </div>
                    </form>
                </div>

                {/* Categories */}
                <div className="max-w-7xl mx-auto px-6 mb-32">
                    <h2 className="text-2xl font-bold mb-10 border-b border-black pb-4 inline-block">Explore Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="group border border-gray-200 p-6 rounded-2xl hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center gap-4 hover:shadow-lg">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                                    {cat.icon}
                                </div>
                                <span className="font-bold text-lg">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Section */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-5xl font-bold tracking-tighter">Trending Now</h2>
                        <button onClick={() => navigate('/events')} className="hidden md:flex items-center gap-2 font-bold border-b-2 border-black pb-1 hover:text-gray-600 transition-colors">
                            View all <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group cursor-pointer" onClick={() => navigate(`/events/${i}`)}>
                                <div className="h-[300px] overflow-hidden rounded-3xl mb-6 relative bg-gray-200">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1501281668745 + i}-fbbaf5e297c8?auto=format&fit=crop&q=80&w=400&h=600`}
                                        alt="Event"
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/400x600?text=Event+Image";
                                        }}
                                    />
                                </div>
                                <h3 className="font-bold text-xl mb-1 group-hover:underline">Music Festival 2026</h3>
                                <p className="text-gray-500 text-sm">Allahabad, India</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;