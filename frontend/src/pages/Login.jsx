import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Password
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/';
    const isOrganizer = from.includes('organizer');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) setStep(2);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            // Check usage of optional chaining and ensure user object exists
            if (res.user?.role === 'organizer') {
                navigate('/organizer/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gray-100">
                <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Login Banner"
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 text-white z-10 p-8">
                    <h2 className="text-4xl font-bold mb-4">Discover the best events near you.</h2>
                    <p className="text-lg opacity-90">Join millions of people who organize and attend events every day.</p>
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
                        {step === 1
                            ? (isOrganizer ? "Log in to Organize" : "Welcome!")
                            : "Welcome back"}
                    </h1>
                    <p className="text-gray-500">
                        {step === 1
                            ? (isOrganizer ? "Enter your email to access the dashboard." : "What's your email?")
                            : `Enter your password for ${email}`}
                    </p>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black outline-none transition-all rounded-none"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold transition-colors flex items-center justify-center gap-2 rounded-none"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-black">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-600 hover:text-black hover:underline"
                                    >
                                        Change email
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black outline-none transition-all rounded-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold transition-colors rounded-none"
                            >
                                Log In
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account? <span onClick={() => navigate('/register', { state: { from: location.state?.from } })} className="text-black font-bold hover:underline cursor-pointer">Sign up</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
