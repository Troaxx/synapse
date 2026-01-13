import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('reports');
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit User State
    const [editingUser, setEditingUser] = useState(null);
    const [editBio, setEditBio] = useState('');
    const [editName, setEditName] = useState('');
    const [editReason, setEditReason] = useState('');
    const [isResettingPhoto, setIsResettingPhoto] = useState(false);

    const [resolveModal, setResolveModal] = useState(null);
    const [timeoutHours, setTimeoutHours] = useState(0);
    const [timeoutReason, setTimeoutReason] = useState('');

    useEffect(() => {
        if (activeTab === 'reports') loadReports();
        else loadUsers();
    }, [activeTab]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getAllReports();
            setReports(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResolveModal = (report) => {
        setResolveModal(report);
        setTimeoutHours(0);
        setTimeoutReason('');
    }

    const handleConfirmResolve = async () => {
        if (!resolveModal) return;
        if (timeoutHours > 0 && !timeoutReason) {
            alert('Please provide a reason for the timeout.');
            return;
        }

        try {
            await adminAPI.resolveReport(resolveModal._id, {
                suspensionHours: timeoutHours,
                suspensionReason: timeoutReason
            });
            setResolveModal(null);
            loadReports();
        } catch (err) {
            alert('Failed to resolve');
            console.error(err);
        }
    };

    const handleDismissReport = async (id) => {
        try {
            await adminAPI.dismissReport(id);
            loadReports();
        } catch (err) {
            alert('Failed to dismiss');
        }
    };

    const openEditUser = (user) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditBio(user.bio || '');
        setEditReason('');
        setIsResettingPhoto(false);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editReason) return alert('Reason is required');

        try {
            const updates = {
                name: editName,
                bio: editBio,
                reason: editReason
            };
            if (isResettingPhoto) updates.profilePhoto = '';

            await adminAPI.updateUser(editingUser._id, updates);
            alert('User updated and notified.');
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to update user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        className={`pb-2 px-1 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                    <button
                        className={`pb-2 px-1 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Manage Users
                    </button>
                </div>

                {loading ? <p>Loading...</p> : (
                    <>
                        {activeTab === 'reports' && (
                            <div className="space-y-4">
                                {reports.length === 0 && <p className="text-gray-500">No reports found.</p>}
                                {reports.map(report => (
                                    <div key={report._id} className="bg-white p-6 rounded-lg shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`inline-block px-2 py-1 text-xs rounded font-semibold mb-2 ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                                <h3 className="font-bold text-lg">{report.reason}</h3>
                                                <p className="text-gray-600 mt-1">{report.details}</p>
                                                <div className="mt-4 text-sm text-gray-500 space-y-1">
                                                    <p><strong>Session ID:</strong> <span className="font-mono bg-gray-100 px-1 rounded">{report.session?._id || 'N/A'}</span></p>
                                                    <p><strong>Reported User:</strong> {report.reportedUser?.name} ({report.reportedUser?.email})</p>
                                                    <p><strong>Reporter:</strong> {report.reporter?.name} ({report.reporter?.email})</p>
                                                    <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {report.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleOpenResolveModal(report)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                )}
                                                {report.status !== 'Pending' && (
                                                    <span className="text-gray-400 text-sm italic">No actions available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full p-2 border rounded mb-6"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />

                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map(u => (
                                                <tr key={u._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                {u.profilePhoto ? (
                                                                    <img className="h-10 w-10 rounded-full object-cover" src={u.profilePhoto} alt="" />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">{u.name[0]}</div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                                <div className="text-sm text-gray-500">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {u.isAdmin ? 'Admin' : 'Student'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button onClick={() => openEditUser(u)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ... existing edit user modal ... */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Edit User: {editingUser.name}</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isResettingPhoto}
                                        onChange={e => setIsResettingPhoto(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-red-600">Remove/Reset Profile Photo?</span>
                                </label>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2 text-red-600">Reason for Action (Required)</label>
                                <textarea
                                    value={editReason}
                                    onChange={e => setEditReason(e.target.value)}
                                    className="w-full border border-red-300 rounded px-3 py-2"
                                    placeholder="Explain why you are modifying this user's profile..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Save & Notify</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Details Modal */}
            {resolveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
                            <button onClick={() => setResolveModal(null)} className="text-gray-400 hover:text-gray-600 transistion-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Session Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Session Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Session ID:</span>
                                        <span className="font-mono text-gray-900 bg-gray-200 px-2 py-0.5 rounded text-xs">{resolveModal.session?._id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subject:</span>
                                        <span className="font-medium text-gray-900">{resolveModal.session?.subject || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date:</span>
                                        <span className="text-gray-900">{resolveModal.session?.date ? new Date(resolveModal.session.date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Report Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Report Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reason:</span>
                                        <span className="font-medium text-red-600">{resolveModal.reason}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reporter:</span>
                                        <span className="text-gray-900">{resolveModal.reporter?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reported User:</span>
                                        <span className="text-gray-900">{resolveModal.reportedUser?.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Detailed Description</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
                                {resolveModal.details || "No additional details provided."}
                            </div>
                        </div>

                        <div className="mb-6 bg-yellow-50 rounded-lg p-5 border border-yellow-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Take Action
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700">Timeout/Suspend Student (Optional)</label>
                                <select
                                    value={timeoutHours}
                                    onChange={(e) => setTimeoutHours(Number(e.target.value))}
                                    className="w-full border border-yellow-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                                >
                                    <option value={0}>No Timeout (Resolve Only)</option>
                                    <option value={1}>1 Hour Suspension</option>
                                    <option value={3}>3 Hours Suspension</option>
                                    <option value={6}>6 Hours Suspension</option>
                                    <option value={12}>12 Hours Suspension</option>
                                    <option value={24}>24 Hours Suspension</option>
                                </select>
                            </div>

                            {timeoutHours > 0 && (
                                <div className="mb-0 animate-fadeIn">
                                    <label className="block text-sm font-bold mb-2 text-red-600">Timeout Reason (Required)</label>
                                    <textarea
                                        value={timeoutReason}
                                        onChange={e => setTimeoutReason(e.target.value)}
                                        className="w-full border border-red-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        placeholder="Explain why you are suspending this student..."
                                        rows="2"
                                    ></textarea>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to dismiss this report?')) {
                                        handleDismissReport(resolveModal._id);
                                        setResolveModal(null);
                                    }
                                }}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
                            >
                                Dismiss Report
                            </button>
                            <div className="flex-1"></div>
                            <button
                                onClick={() => setResolveModal(null)}
                                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmResolve}
                                className={`px-6 py-2 text-white rounded-lg font-medium shadow-sm transition-colors ${timeoutHours > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {timeoutHours > 0 ? 'Suspend & Resolve' : 'Resolve Report'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
