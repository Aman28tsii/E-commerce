import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users with token:", token); // Debug here
                const response = await axios.get('http://localhost:3000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err); // More detailed logging
                setError(err.response ? err.response.data.message : 'Error fetching users');
            }
        };

        if (token) {
            fetchUsers();
        } else {
            setError('No token found. Please log in.');
        }
    }, [token]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">User Management</h2>
            <p className="mb-4 text-gray-600">Manage your Users here.</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <h3 className="text-lg font-semibold mb-2">User List</h3>
            <ul className="list-disc list-inside">
                {users.map((user) => (
                    <li key={user.id} className="text-gray-800 mb-1">
                        {user.username} (<span className="text-gray-600">{user.email}</span>)
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;