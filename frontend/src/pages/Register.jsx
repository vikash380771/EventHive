import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, User } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Check if the user is trying to access organizer routes
    const isOrganizerIntent = from.includes('organizer');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: isOrganizerIntent ? 'organizer' : 'user'
    });
    const { register } = useAuth();
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData.username, formData.email, formData.password, formData.role);
        if (res.success) {
            navigate(from, { replace: true });
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gray-100">
                <img
                    src="https://images.unsplash.com/photo-1514525253440-b393452e2729?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Register Banner"
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 text-white z-10 p-8">
                    <h2 className="text-4xl font-bold mb-4">Create your own events.</h2>
                    <p className="text-lg opacity-90">Start an event, invite your friends, and make memories.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="max-w-md w-full space-y-8">
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-xl rounded-2xl">
                            E
                        </div>
                        <span className="text-2xl font-bold text-black tracking-tight">
                            EventHive
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-black">
                        {isOrganizerIntent ? "Become an Organizer" : "Create an account"}
                    </h1>
                    <p className="text-gray-500">
                        {isOrganizerIntent ? "Join EventHive to start hosting events." : "Join EventHive to get started."}
                    </p>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black outline-none transition-all rounded-none"
                                placeholder="John Doe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black outline-none transition-all rounded-none"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black outline-none transition-all rounded-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold transition-colors rounded-none"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account? <span onClick={() => navigate('/login', { state: { from: location.state?.from } })} className="text-black font-bold hover:underline cursor-pointer">Log in</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
