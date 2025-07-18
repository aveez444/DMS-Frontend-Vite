import React, { useState, useEffect } from "react";

const ListPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${backendUrl}/permissions/`)
      .then((res) => res.json())
      .then((data) => setPermissions(data))
      .catch((err) => console.error("Error fetching permissions:", err));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">List of Permissions</h3>
      <ul className="list-disc pl-5">
        {permissions.map((perm) => (
          <li key={perm.id}>{perm.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListPermissions;
