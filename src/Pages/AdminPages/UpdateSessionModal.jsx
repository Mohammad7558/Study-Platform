import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UpdateSessionModal = ({ session, onClose, onSuccess, axiosSecure }) => {
    const [formData, setFormData] = useState({
        title: session.title,
        description: session.description,
        sessionType: session.sessionType || 'free',
        price: session.price || 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosSecure.patch(`/admin/sessions/${session._id}/update`, {
                title: formData.title,
                description: formData.description,
                sessionType: formData.sessionType,
                price: formData.sessionType === 'paid' ? formData.price : 0
            });
            toast.success('Session updated successfully!');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update session');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Update Session
                    </h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

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
                                        checked={formData.sessionType === 'free'}
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Free</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio"
                                        name="sessionType"
                                        value="paid"
                                        checked={formData.sessionType === 'paid'}
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Paid</span>
                                </label>
                            </div>
                        </div>

                        {formData.sessionType === 'paid' && (
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (USD) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="1"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required={formData.sessionType === 'paid'}
                                />
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Session'}
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

export default UpdateSessionModal;