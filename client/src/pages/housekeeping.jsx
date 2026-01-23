import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../services/auth";

function Housekeeping() {
  const navigate = useNavigate();

  const [cleaningList, setCleaningList] = useState([]);
  const [cleanerslist, setCleanerslist] = useState([]);
  const [cleanStart, setCleanStart] = useState({
    roomNo: "",
    assignedTo: "",
    status: "IN_PROGRESS",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [cleanerFilter, setCleanerFilter] = useState("");
  const [roomNoFilter, setRoomNoFilter] = useState("");

  // Fetches all users and filters for cleaners only
  async function fetchusersdata() {
    try {
      const users = await fetch("https://hotel-management-system-2spj.onrender.com/api/users/allusers");
      const usersdata = await users.json();
      const cleaners = usersdata.filter((user) => user.role === "cleaner");
      setCleanerslist(cleaners);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // Fetches all cleaning tasks from the API
  async function allcleanings() {
    try {
      const fetchdata = await fetch(
        "https://hotel-management-system-2spj.onrender.com/api/cleanings/allcleanings",
      );
      const res = await fetchdata.json();
      setCleaningList(res);
    } catch (err) {
      console.error("Error fetching cleanings:", err);
    }
  }

  // Starts a cleaning task for a specific room and assigns a cleaner
  async function startCleaning(roomNo) {
    try {
      const userdata = JSON.parse(localStorage.getItem("userdata")) || {};
      const token = userdata.token;
      const res = await fetch(
        `https://hotel-management-system-2spj.onrender.com/api/cleanings/startcleaning/${roomNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...cleanStart,
            roomNo: roomNo,
            status: "IN_PROGRESS",
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        allcleanings();
      } else {
        console.error("Error starting cleaning:", data.message);
      }
    } catch (err) {
      console.error("Error starting cleaning:", err);
    }
  }

  // Marks a cleaning task as completed for a specific room
  async function completeCleaning(roomNo) {
    try {
      const userdata = JSON.parse(localStorage.getItem("userdata")) || {};
      const token = userdata.token;
      const res = await fetch(
        `https://hotel-management-system-2spj.onrender.com/api/cleanings/completecleaning/${roomNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomNo: roomNo,
            status: "COMPLETED",
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        allcleanings();
      } else {
        console.error("Error completing cleaning:", data.message);
      }
    } catch (err) {
      console.error("Error completing cleaning:", err);
    }
  }

  // Verifies user authentication and loads initial data on component mount
  useEffect(() => {
    async function init() {
      const result = await verifyToken();
      if (!result.ok) {
        return navigate("/login");
      }
      fetchusersdata();
      allcleanings();
    }
    init();
  }, []);

  // Filters cleaning tasks based on status, date, cleaner name, and room number
  const filteredCleanings = cleaningList.filter((cleaning) => {
    const matchesStatus = !statusFilter || cleaning.status === statusFilter || 
      (statusFilter === "cleaning_needed" && cleaning.status === "cleaning_needed");
    const matchesDate = !dateFilter || 
      (cleaning.assignedAt && new Date(cleaning.assignedAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()) ||
      (cleaning.completedAt && new Date(cleaning.completedAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString());
    const matchesCleaner = !cleanerFilter || 
      (cleaning.assignedTo && cleaning.assignedTo.toLowerCase().includes(cleanerFilter.toLowerCase()));
    const matchesRoomNo = !roomNoFilter || 
      (cleaning.roomNo && cleaning.roomNo.toLowerCase().includes(roomNoFilter.toLowerCase()));
    
    return matchesStatus && matchesDate && matchesCleaner && matchesRoomNo;
  });

  return (
    <>
      <div className="housekeeping-header">
        <div>
          <h1 className="housekeeping-title">Housekeeping</h1>
          <p className="housekeeping-subtitle">
            Track cleaning status and assign cleaners.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="reservation-toggle-btn"
            style={{
              background: showFilter ? "#000000" : "#ffffff",
              color: showFilter ? "#ffffff" : "#374151",
              borderColor: "#000000",
              padding: "12px 20px",
              fontSize: "14px",
              height: "auto",
              lineHeight: "1.5",
            }}
          >
            <i className={`fas ${showFilter ? "fa-filter-circle-xmark" : "fa-filter"}`}></i>
            {showFilter ? "Hide Filter" : "Filter"}
          </button>
          <div className="housekeeping-badge">
            <i className="fas fa-user-hard-hat"></i>
            Cleaners: {cleanerslist.length}
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="reservation-filter-box">
          <div className="reservation-filter-content">
            <div className="reservation-filter-section">
              <i className="fas fa-filter reservation-filter-icon"></i>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">All Status</option>
                <option value="cleaning_needed">Cleaning Needed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="reservation-filter-section">
              <i className="fas fa-calendar reservation-filter-icon"></i>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by Date"
                style={{ flex: 1 }}
              />
            </div>

            <div className="reservation-filter-section">
              <i className="fas fa-user reservation-filter-icon"></i>
              <input
                type="text"
                value={cleanerFilter}
                onChange={(e) => setCleanerFilter(e.target.value)}
                placeholder="Filter by Cleaner Name"
                style={{ flex: 1 }}
              />
            </div>

            <div className="reservation-filter-section">
              <i className="fas fa-door-open reservation-filter-icon"></i>
              <input
                type="text"
                value={roomNoFilter}
                onChange={(e) => setRoomNoFilter(e.target.value)}
                placeholder="Filter by Room No"
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="housekeeping-table-container">
        <table className="housekeeping-table">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Housekeeper</th>
              <th>Status</th>
              <th>Assigned At</th>
              <th>Completed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredCleanings) && filteredCleanings.length > 0 ? (
              filteredCleanings.map((cleaning, index) => (
                <tr key={cleaning._id || index}>
                  <td>
                    <strong>{cleaning.roomNo}</strong>
                  </td>
                  <td>
                    {cleaning.assignedTo ? (
                      <span>{cleaning.assignedTo}</span>
                    ) : (
                      <select
                        className="housekeeping-select"
                        onChange={(e) => {
                          const selectedCleaner = cleanerslist.find(
                            (c) => c._id === e.target.value,
                          );
                          setCleanStart({
                            ...cleanStart,
                            assignedTo: selectedCleaner?.name,
                            roomNo: cleaning.roomNo,
                          });
                        }}
                      >
                        <option value="">Select Cleaner</option>
                        {cleanerslist.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {cleaning.status === "cleaning_needed" ? (
                      <span className="status-badge pending">
                        <i className="fas fa-clock"></i>
                        {cleaning.status}
                      </span>
                    ) : cleaning.status === "IN_PROGRESS" ? (
                      <span className="status-badge in-progress">
                        <i className="fas fa-spinner"></i>
                        {cleaning.status}
                      </span>
                    ) : (
                      <span className="status-badge completed">
                        <i className="fas fa-check-circle"></i>
                        {cleaning.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {cleaning.assignedAt
                      ? new Date(cleaning.assignedAt).toLocaleString()
                      : "--"}
                  </td>
                  <td>
                    {cleaning.completedAt
                      ? new Date(cleaning.completedAt).toLocaleString()
                      : "--"}
                  </td>
                  <td>
                    {cleaning.status === "cleaning_needed" && (
                      <button
                        onClick={() => startCleaning(cleaning.roomNo)}
                        className="action-button start"
                      >
                        <i className="fas fa-play"></i>
                        Start
                      </button>
                    )}
                    {cleaning.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => completeCleaning(cleaning.roomNo)}
                        className="action-button complete"
                      >
                        <i className="fas fa-check"></i>
                        Complete
                      </button>
                    )}
                    {cleaning.status === "COMPLETED" && (
                      <span className="status-badge completed">
                        <i className="fas fa-check-circle"></i>
                        COMPLETED
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No cleaning tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Housekeeping;
