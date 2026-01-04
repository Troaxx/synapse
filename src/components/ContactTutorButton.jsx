import React, { useState } from 'react';

const ContactTutorButton = ({ tutor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDialog = () => setIsOpen(!isOpen);

    if (!tutor) return null;

    return (
        <>
            <button
                onClick={toggleDialog}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
                Contact Tutor
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleDialog}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Contact via MS Teams</h2>
                                <button
                                    onClick={toggleDialog}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    To contact <span className="font-semibold">{tutor.name}</span>, please use Microsoft Teams or Email.
                                </p>

                                {tutor.email && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                                            <span className="text-gray-900 select-all truncate mr-2">{tutor.email}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(tutor.email);
                                                    alert('Email copied to clipboard!');
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 font-medium mb-2">How to contact via Teams:</p>
                                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                        <li>Open Microsoft Teams</li>
                                        <li>Search for the tutor by their name or email</li>
                                        <li>Send them a message or start a chat</li>
                                    </ul>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={toggleDialog}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactTutorButton;
