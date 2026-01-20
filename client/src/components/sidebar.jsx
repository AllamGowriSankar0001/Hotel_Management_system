import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  const userName = userdata?.user?.name || "User";
  const userRole = userdata?.user?.role || "Staff";
  const isAdmin = userRole?.toLowerCase() === "admin";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/rooms", label: "Rooms", icon: "fa-door-open" },
    { path: "/reservation", label: "Reservations", icon: "fa-calendar-check" },
    { path: "/housekeeping", label: "Housekeeping", icon: "fa-broom" },
    ...(isAdmin ? [{ path: "/users", label: "Users", icon: "fa-users" }] : []),
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo-section">
        <h1 className="sidebar-logo">ROYAL VILLAS</h1>
        <h1 className="sidebar-logo1">RV</h1>

        <p className="sidebar-subtitle">Hotel Management</p>
      </div>

      <div className="sidebar-user-section">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="sidebar-user-details">
            <p className="sidebar-user-name">{userName}</p>
            <p className="sidebar-user-role">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <i className={`fas ${item.icon} sidebar-icon`}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
