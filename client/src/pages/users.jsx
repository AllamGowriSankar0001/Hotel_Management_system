import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../App.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userfromshow, setUserfromshow] = useState(false);
  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [updateUserData, setUpdateUserData] = useState(
    {
      name: "",
      email: "",
      phone: "",
    }
  )
  const [editingUserId, setEditingUserId] = useState(null);

  const userdata = JSON.parse(localStorage.getItem("userdata"));
  if (!userdata) {
    return <Navigate to="/login" />;
  }

  const userRole = userdata?.user?.role || "Staff";
  const isAdmin = userRole?.toLowerCase() === "admin";
  async function deleteUser(userId, token) {
    const confirmDelete = await fetch(
      `https://hotel-management-system-2spj.onrender.com/api/users/deleteuser/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (confirmDelete.ok) {
      fetchUsers();
    } else {
      console.error("Error deleting user");
    }
  }
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch("https://hotel-management-system-2spj.onrender.com/api/users/allusers");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }
  async function updateUser(id) {
    try {
      // console.log("Updating user:", id, updateUserData);
      const res = await fetch(`https://hotel-management-system-2spj.onrender.com/api/users/updateuser/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${userdata.token}`
        },
        body:JSON.stringify(updateUserData)
      });
      const data = await res.json();
      // console.log("Update response:", data);
      
      if (!res.ok) {
          alert(data.message || "Error updating user");
          return;
        }

        alert("User updated successfully!");
        setUpdateUserData({
          name: "",
          email: "",
          phone: ""
        });
        setEditingUserId(null);
        fetchUsers();
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
  async function addUser() {
    try {
      const newUser = await fetch(`https://hotel-management-system-2spj.onrender.com/api/users/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userdata.token}`,
        },
        body: JSON.stringify(createUser),
      });
      
      const data = await newUser.json();
      
      if (!newUser.ok) {
        alert(data.message || "Error creating user");
        return;
      }
      
      setCreateUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
      setUserfromshow(false);
      fetchUsers();
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="content1">
      <div className="users-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage all system users and their roles</p>
        </div>
        <div>
          <button onClick={()=>{setUserfromshow(!userfromshow)}}>
            <i className="fa-solid fa-plus" style={{ marginRight: "5px" }}>
              {" "}
            </i>{" "}
            Add User
          </button>
        </div>
      </div>
      { userfromshow ?

      <div className="user-form-card">
        <h2>Create New User</h2>

        <div className="user-form-grid">
          <input
            type="text"
            placeholder="Full Name"
            value={createUser.name}
            onChange={(e) =>
              setCreateUser({ ...createUser, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address (Optional)"
            value={createUser.email}
            onChange={(e) =>
              setCreateUser({ ...createUser, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={createUser.phone}
            onChange={(e) =>
              setCreateUser({ ...createUser, phone: e.target.value })
            }
          />

          <select
            value={createUser.role}
            onChange={(e) =>
              setCreateUser({ ...createUser, role: e.target.value })
            }
            className="user-form-select"
          >
            <option value="">Select Role</option>
            <option value="reception">Reception</option>
            <option value="admin">Admin</option>
            <option value="cleaner">Cleaner</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            value={createUser.password}
            onChange={(e) =>
              setCreateUser({ ...createUser, password: e.target.value })
            }
          />
        </div>

        <button className="create-user-btn" onClick={addUser}>
          <i className="fa-solid fa-user-plus"></i>
          Create User
        </button>
      </div> : null
      }

      {editingUserId && (
        <div className="user-form-card">
          <h2>Edit User</h2>

          <div className="user-form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={updateUserData.name}
              onChange={(e) =>
                setUpdateUserData({ ...updateUserData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address (Optional)"
              value={updateUserData.email}
              onChange={(e) =>
                setUpdateUserData({ ...updateUserData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={updateUserData.phone}
              onChange={(e) =>
                setUpdateUserData({ ...updateUserData, phone: e.target.value })
              }
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button className="create-user-btn" onClick={() => updateUser(editingUserId)}>
              <i className="fa-solid fa-save"></i>
              Save Changes
            </button>
            <button 
              className="create-user-btn" 
              style={{ backgroundColor: "#6c757d" }}
              onClick={() => {
                setEditingUserId(null);
                setUpdateUserData({ name: "", email: "", phone: "" });
              }}
            >
              <i className="fa-solid fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
      )}

      

      
      

      {loading ? (
        <div className="loading-container">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="professional-table-container">
          <table className="professional-table">
            <thead>
              <tr>
                <th className="table-header">User ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Role</th>
                <th className="table-header">Email</th>
                <th className="table-header">Phone</th>

                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="table-cell"
                    style={{ textAlign: "center" }}
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td className="table-cell">{user.id}</td>
                    <td className="table-cell">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={updateUserData.name}
                          onChange={(e) =>
                            setUpdateUserData({ ...updateUserData, name: e.target.value })
                          }
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`status-badge status-${user.role?.toLowerCase()}`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell">
                      {editingUserId === user.id ? (
                        <input
                          type="email"
                          value={updateUserData.email}
                          onChange={(e) =>
                            setUpdateUserData({ ...updateUserData, email: e.target.value })
                          }
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        user.email || "N/A"
                      )}
                    </td>
                    <td className="table-cell">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={updateUserData.phone}
                          onChange={(e) =>
                            setUpdateUserData({ ...updateUserData, phone: e.target.value })
                          }
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        user.phone || "N/A"
                      )}
                    </td>
                    {user.role !== userdata.user.role ? (
                      <td className="table-cell">
                        {editingUserId === user.id ? (
                          <>
                            <button
                              style={{
                                fontSize: "15px",
                                width: "50px",
                                margin: "5px",
                                backgroundColor: "#01cc01",
                              }}
                              onClick={() => updateUser(user.id)}
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button
                              style={{
                                fontSize: "15px",
                                width: "50px",
                                margin: "5px",
                                backgroundColor: "#6c757d",
                              }}
                              onClick={() => {
                                setEditingUserId(null);
                                setUpdateUserData({ name: "", email: "", phone: "" });
                              }}
                            >
                              <i className="fa-solid fa-times"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              style={{
                                fontSize: "15px",
                                width: "50px",
                                margin: "5px",
                                backgroundColor: "red",
                              }}
                              onClick={() => deleteUser(user.id, userdata.token)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                              style={{
                                fontSize: "15px",
                                width: "50px",
                                margin: "5px",
                                backgroundColor: "#01cc01",
                              }}
                              onClick={() => {
                                setEditingUserId(user.id);
                                setUpdateUserData({
                                  name: user.name,
                                  email: user.email || "",
                                  phone: user.phone
                                });
                              }}
                            >
                              <i className="fa-solid fa-user-pen"></i>
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td className="table-cell">-</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
}

export default Users;
