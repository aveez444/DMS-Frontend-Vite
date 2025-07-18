import React, { useState, useEffect } from "react";

const AssignPermission = () => {
  const [users, setUsers] = useState([]); // List of users
  const [permissions, setPermissions] = useState([]); // List of permissions
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [userPermissions, setUserPermissions] = useState({}); // User's assigned permissions

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  // Fetch Users and Permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${backendUrl}/list-users/`);
        const usersData = await usersResponse.json();

        const permissionsResponse = await fetch(`${backendUrl}/permissions/`);
        const permissionsData = await permissionsResponse.json();

        setUsers(usersData);
        setPermissions(permissionsData);

        // Map permissions for each user
        const userPermMap = {};
        usersData.forEach((user) => {
          userPermMap[user.id] = user.permissions.map((perm) => perm.name); // Use 'name' field
        });
        setUserPermissions(userPermMap);
      } catch (err) {
        setError("Fetched Data Successfully");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Toggle Permission
  const togglePermission = async (userId, permissionName, isAssigned) => {
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/assign-permissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId, // Pass ID as 'user_id'
          permission: permissionName, // Single permission name
          status: !isAssigned, // Toggle status
        }),
      });

      if (response.ok) {
        const updatedUserPerms = { ...userPermissions };

        if (isAssigned) {
          // Remove permission
          updatedUserPerms[userId] = updatedUserPerms[userId].filter(
            (perm) => perm !== permissionName
          );
        } else {
          // Add permission
          updatedUserPerms[userId] = [...(updatedUserPerms[userId] || []), permissionName];
        }

        setUserPermissions(updatedUserPerms);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update permissions.");
      }
    } catch (err) {
      setError("Error updating permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assign Permissions</h2>
      {loading && <p className="text-blue-500">Updating permissions...</p>}
      {error && <p className="text-green-500">{error}</p>}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-4">Username</th>
            <th className="border p-4">Email</th>
            {permissions.map((perm) => (
              <th key={perm.id} className="border p-4">{perm.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="border p-4">{user.username}</td>
              <td className="border p-4">{user.email}</td>
              {permissions.map((perm) => {
                const isAssigned = userPermissions[user.id]?.includes(perm.name);
                return (
                  <td key={perm.id} className="border p-4 text-center">
                    <label className="flex items-center justify-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() =>
                          togglePermission(user.id, perm.name, isAssigned)
                        }
                      />
                      <span>{isAssigned ? "ON" : "OFF"}</span>
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignPermission;
