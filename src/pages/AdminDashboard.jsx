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

    const handleResolveReport = async (id) => {
        try {
            await adminAPI.resolveReport(id);
            loadReports();
        } catch (err) {
            alert('Failed to resolve');
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
            if (isResettingPhoto) currentPhoto = ''; // This logic needs to be passed to backend safely
            // Let's pass 'profilePhoto' only if changing. 
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
                                                <div className="mt-4 text-sm text-gray-500">
                                                    <p><strong>Reported User:</strong> {report.reportedUser?.name} ({report.reportedUser?.email})</p>
                                                    <p><strong>Reporter:</strong> {report.reporter?.name} ({report.reporter?.email})</p>
                                                    <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {report.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleDismissReport(report._id)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Dismiss</button>
                                                        <button onClick={() => handleResolveReport(report._id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Resolve</button>
                                                    </>
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
        </div>
    );
};

export default AdminDashboard;
