import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Coffee, Heart } from 'lucide-react';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-xl rounded-2xl">
                        E
                    </div>
                    <span className="text-2xl font-bold text-black tracking-tight">
                        EventHive
                    </span>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-6 text-center mb-24">
                <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
                    WE BUILD <br />
                    <span className="text-gray-400">CONNECTIONS</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-10">
                    EventHive is a platform dedicated to bringing people together through shared experiences.
                    From intimate gatherings to large-scale festivals, we believe in the power of community.
                </p>
            </div>

            {/* Values */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <div className="p-8 border border-gray-200 hover:border-black transition-colors rounded-3xl">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                        <Star />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Quality First</h3>
                    <p className="text-gray-500">
                        We curate only the best events to ensure that every experience you find on EventHive is worth your time.
                    </p>
                </div>
                <div className="p-8 border border-gray-200 hover:border-black transition-colors rounded-3xl">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                        <Coffee />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Community Focused</h3>
                    <p className="text-gray-500">
                        We prioritize events that foster connection and build stronger, more vibrant local communities.
                    </p>
                </div>
                <div className="p-8 border border-gray-200 hover:border-black transition-colors rounded-3xl">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                        <Heart />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Passion Driven</h3>
                    <p className="text-gray-500">
                        Our platform is built by people who love events, for people who love events.
                    </p>
                </div>
            </div>

            {/* Footer Fix */}
            <div className="text-center py-12 border-t border-gray-100">
                <p className="text-gray-400 text-sm">© 2026 EventHive. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AboutUs;
