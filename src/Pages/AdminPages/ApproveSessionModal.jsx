import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ApproveSessionModal = ({ session, onClose, onSuccess, axiosSecure }) => {
    const [sessionType, setSessionType] = useState('free');
    const [price, setPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosSecure.patch(`/admin/sessions/${session._id}/approve`, {
                sessionType,
                price: sessionType === 'paid' ? price : 0
            });
            toast.success('Session approved successfully!');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve session');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Approve Session: {session.title}
                    </h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio"
                                        name="sessionType"
                                        value="free"
                                        checked={sessionType === 'free'}
                                        onChange={() => setSessionType('free')}
                                    />
                                    <span className="ml-2">Free</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio"
                                        name="sessionType"
                                        value="paid"
                                        checked={sessionType === 'paid'}
                                        onChange={() => setSessionType('paid')}
                                    />
                                    <span className="ml-2">Paid</span>
                                </label>
                            </div>
                        </div>

                        {sessionType === 'paid' && (
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (USD)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    min="1"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                                    required
                                />
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Approving...' : 'Approve Session'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApproveSessionModal;