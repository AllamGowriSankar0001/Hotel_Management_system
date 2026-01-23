import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../App.css";

function Users() {
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  if (!userdata) {
    return <Navigate to="/login" />;
  }

  const userRole = userdata?.user?.role || "Staff";
  const isAdmin = userRole?.toLowerCase() === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userfromshow, setUserfromshow] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [updateUserData, setUpdateUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetches all users from the API
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

  // Creates a new user with the provided details
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

  // Updates an existing user's information
  async function updateUser(id) {
    try {
      const res = await fetch(`https://hotel-management-system-2spj.onrender.com/api/users/updateuser/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${userdata.token}`
        },
        body:JSON.stringify(updateUserData)
      });
      const data = await res.json();
      
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

  // Deletes a user from the system
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

  // Fetches users when component mounts and user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Filters users based on name search and role selection
  const filteredUsers = users.filter((user) => {
    const matchesName = searchName === "" || 
      user.name?.toLowerCase().includes(searchName.toLowerCase()) ||
      user.id?.toString().includes(searchName);
    
    const matchesRole = roleFilter === "all" || 
      user.role?.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesName && matchesRole;
  });

  return (
    <div className="content1">
      <div className="users-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage all system users and their roles</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="reservation-toggle-btn"
            style={{
              background: showFilter ? "#000000" : "#ffffff",
              color: showFilter ? "#ffffff" : "#374151",
              borderColor: showFilter ? "#000000" : "#000000",
            }}
          >
            <i className={`fas ${showFilter ? "fa-times" : "fa-filter"}`}></i>
            {showFilter ? "Hide" : "Filter"}
          </button>
          <button 
            type="button"
            onClick={()=>{setUserfromshow(!userfromshow)}}
            className="reservation-toggle-btn"
            style={{
              background: userfromshow ? "#000000" : "#ffffff",
              color: userfromshow ? "#ffffff" : "#374151",
              borderColor: userfromshow ? "#000000" : "#000000",
            }}
          >
            <i className={`fa-solid ${userfromshow ? "fa-times" : "fa-plus"}`}></i>
            {userfromshow ? "Hide" : "Add User"}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="reservation-filter-container-single">
          <div className="reservation-filter-box">
            <div className="reservation-filter-header">
              <h2 className="reservation-filter-title">Filter & Search</h2>
              <p className="reservation-filter-subtitle">Search and filter users</p>
            </div>
            
            <div className="reservation-filter-content">
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-search reservation-filter-icon"></i>
                  <input
                    type="text"
                    className="reservation-search-input"
                    placeholder="Search by user name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-user-tag reservation-filter-icon"></i>
                  <select
                    className="reservation-filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="reception">Reception</option>
                    <option value="cleaner">Cleaner</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      { userfromshow &&
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
      </div>
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
            <button 
              type="button"
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#01cc01",
                borderColor: "#01cc01",
                width: "auto",
                minWidth: "120px",
              }}
              onClick={() => updateUser(editingUserId)}
            >
              <i className="fa-solid fa-save" style={{ color: "#01cc01" }}></i>
              <span style={{ color: "#01cc01" }}>Save Changes</span>
            </button>
            <button 
              type="button"
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#ef4444",
                borderColor: "#ef4444",
                width: "auto",
                minWidth: "100px",
              }}
              onClick={() => {
                setEditingUserId(null);
                setUpdateUserData({ name: "", email: "", phone: "" });
              }}
            >
              <i className="fa-solid fa-times" style={{ color: "#ef4444" }}></i>
              <span style={{ color: "#ef4444" }}>Cancel</span>
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-cell"
                    style={{ textAlign: "center" }}
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {editingUserId === user.id ? (
                            <>
                              <button
                                type="button"
                                className="reservation-toggle-btn"
                                style={{
                                  background: "#ffffff",
                                  color: "#01cc01",
                                  borderColor: "#01cc01",
                                  width: "40px",
                                  height: "40px",
                                  minWidth: "40px",
                                  padding: "0",
                                }}
                                onClick={() => updateUser(user.id)}
                              >
                                <i className="fa-solid fa-check" style={{ color: "#01cc01" }}></i>
                              </button>
                              <button
                                type="button"
                                className="reservation-toggle-btn"
                                style={{
                                  background: "#ffffff",
                                  color: "#ef4444",
                                  borderColor: "#ef4444",
                                  width: "40px",
                                  height: "40px",
                                  minWidth: "40px",
                                  padding: "0",
                                }}
                                onClick={() => {
                                  setEditingUserId(null);
                                  setUpdateUserData({ name: "", email: "", phone: "" });
                                }}
                              >
                                <i className="fa-solid fa-times" style={{ color: "#ef4444" }}></i>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="reservation-toggle-btn"
                                style={{
                                  background: "#ffffff",
                                  color: "#ef4444",
                                  borderColor: "#ef4444",
                                  width: "40px",
                                  height: "40px",
                                  minWidth: "40px",
                                  padding: "0",
                                  marginTop: "0px",
                                }}
                                onClick={() => deleteUser(user.id, userdata.token)}
                              >
                                <i className="fa-solid fa-trash" style={{ color: "#ef4444" }}></i>
                              </button>
                              <button
                                type="button"
                                className="reservation-toggle-btn"
                                style={{
                                  background: "#ffffff",
                                  color: "#01cc01",
                                  borderColor: "#01cc01",
                                  width: "40px",
                                  height: "40px",
                                  minWidth: "40px",
                                  padding: "0",
                                  marginTop: "0px",

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
                                <i className="fa-solid fa-user-pen" style={{ color: "#01cc01" }}></i>
                              </button>
                            </>
                          )}
                        </div>
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
