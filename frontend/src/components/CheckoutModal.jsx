import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CheckoutModal = ({ isOpen, onClose, event, onRegisterSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Quantity, 2: Form, 3: Success
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        firstName: user?.username?.split(' ')[0] || '',
        lastName: user?.username?.split(' ')[1] || '',
        email: user?.email || ''
    });

    if (!isOpen || !event) return null;

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // For now, API only supports single registration per user per call
            // In a real app, we'd loop or have a bulk API. 
            // Given the requirement "10 registered", we just hit the register endpoint.

            await axios.post(`/events/${event._id}/register`);

            setStep(3);
            setTimeout(() => {
                onRegisterSuccess();
                onClose();
                setStep(1); // Reset for next time
            }, 2000);
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {/* Left Side (Summary) - Visible on md+ */}
                <div className="hidden md:block w-1/3 bg-gray-50 p-6 border-r border-gray-100">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-24 object-cover rounded-none mb-4"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x200'}
                    />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(event.date).toLocaleDateString()}</p>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>1 x General Admission</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4">
                            <span>Total</span>
                            <span>$0.00</span>
                        </div>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="flex-1 p-6 md:p-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center mb-8">Select Tickets</h2>
                            <div className="border border-black p-4 flex justify-between items-center rounded-none">
                                <div>
                                    <p className="font-bold">General Admission</p>
                                    <p className="text-sm text-gray-500">Free</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 border border-black rounded-none"
                                        disabled={quantity <= 1}
                                    >-</button>
                                    <span className="w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))} // Cap at 10 or capacity
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 border border-black rounded-none"
                                    >+</button>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold transition-colors rounded-none"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <button onClick={() => setStep(1)} className="text-sm text-gray-600 hover:text-black hover:underline">
                                    &larr; Back
                                </button>
                                <h2 className="text-xl font-bold">Contact Information</h2>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                                <span>Logged in as {user.email}</span>
                                <span className="text-black font-bold cursor-pointer hover:underline">Not you?</span>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-300 focus:border-black outline-none rounded-none bg-white"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-300 focus:border-black outline-none rounded-none bg-white"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-black mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 border border-gray-300 focus:border-black outline-none rounded-none bg-white"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-2 py-2">
                                    <input type="checkbox" id="updates" className="accent-black rounded-none" defaultChecked />
                                    <label htmlFor="updates" className="text-sm text-gray-600">
                                        Keep me updated on more events and news from this event organizer.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-none"
                                >
                                    {loading ? 'Processing...' : 'Register'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-gray-100 text-black border border-black flex items-center justify-center rounded-none">
                                <Check size={32} />
                            </div>
                            <h2 className="text-2xl font-bold">You're going!</h2>
                            <p className="text-gray-500 text-center">
                                Check your email for your ticket.<br />
                                Order #{Math.floor(Math.random() * 1000000)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
