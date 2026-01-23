import { useEffect, useState } from "react";
import "../App.css";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  if (!userdata) {
    return <Navigate to="/login" />;
  }

  const [totallength, setTotalLength] = useState("");
  const [occupiedlength, setOccupiedLength] = useState("");
  const [cleaninglength, setCleaningLength] = useState("");
  const [cleanerslength, setCleanerslength] = useState("");
  const [availablelength, setAvailableLength] = useState("");
  const [underMaintenance, setUnderMaintenance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetches all users and counts how many are cleaners
  async function fetchusersdata() {
    try {
      const users = await fetch("https://hotel-management-system-2spj.onrender.com/api/users/allusers");
      const usersdata = await users.json();
      let cleaners = usersdata.filter((user) => user.role === "cleaner").length;
      setCleanerslength(cleaners);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // Fetches all rooms and calculates counts for different room statuses
  async function fetchroomdata() {
    try {
      const rooms = await fetch("https://hotel-management-system-2spj.onrender.com/api/rooms/allrooms");
      const roomdata = await rooms.json();
      let occupied = roomdata.filter((room) => room.status === "occupied").length;
      let cleaning = roomdata.filter(
        (room) => room.status === "cleaning_needed"
      ).length;
      let available = roomdata.filter(
        (room) => room.status === "available"
      ).length;
      let maintenance = roomdata.filter(
        (room) => room.status === "under_maintenance"
      ).length;
      setCleaningLength(cleaning);
      setOccupiedLength(occupied);
      setAvailableLength(available);
      setUnderMaintenance(maintenance);
      setTotalLength(roomdata.length);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  
  // Fetches user and room data when component mounts
  useEffect(() => {
    fetchusersdata();
    fetchroomdata();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome-text">Welcome back,</p>
          <h1 className="dashboard-welcome-name">
            {userdata.user.name} <i className="fas fa-hand"></i>
          </h1>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-overview-badge">Today's Overview</div>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card" style={{ background: "#fdf6e3" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Total Rooms</p>
            <i className="fas fa-door-open stat-card-icon" style={{ color: "#8b6914" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#8b6914" }}>
            {totallength || 0}
          </span>
        </div>
        <div className="stat-card" style={{ background: "#e9f7ef" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Available</p>
            <i className="fas fa-check-circle stat-card-icon" style={{ color: "#2e7d32" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#2e7d32" }}>
            {availablelength || 0}
          </span>
        </div>
        <div className="stat-card" style={{ background: "#fde9e3" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Occupied</p>
            <i className="fas fa-bed stat-card-icon" style={{ color: "#c62828" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#c62828" }}>
            {occupiedlength || 0}
          </span>
        </div>
        <div className="stat-card" style={{ background: "#e8f3ff" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Cleaning Needed</p>
            <i className="fas fa-broom stat-card-icon" style={{ color: "#1565c0" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#1565c0" }}>
            {cleaninglength || 0}
          </span>
        </div>
        <div className="stat-card" style={{ background: "#fff3e0" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Cleaners Available</p>
            <i className="fas fa-user-hard-hat stat-card-icon" style={{ color: "#e65100" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#e65100" }}>
            {cleanerslength || 0}
          </span>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #e6c87a 0%, #c6a15b 100%)" }}>
          <div className="stat-card-header">
            <p className="stat-card-title">Under Maintenance</p>
            <i className="fas fa-tools stat-card-icon" style={{ color: "#ffffff" }}></i>
          </div>
          <span className="stat-card-value" style={{ color: "#ffffff", fontSize: "32px" }}>
            {underMaintenance || 0}
          </span>
          <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>
            Rooms being serviced
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
