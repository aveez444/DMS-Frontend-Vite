import React, { useState, useEffect } from "react";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${backendUrl}/list-users/`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">List of Users</h3>
      <ul className="list-disc pl-5">
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;
