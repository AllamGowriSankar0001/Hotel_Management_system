import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../services/auth";

function Housekeeping() {
  const [cleaningList, setCleaningList] = useState([]);
  const [cleanerslist, setCleanerslist] = useState([]);
  const [cleanStart, setCleanStart] = useState({
    roomNo: "",
    assignedTo: "",
    status: "IN_PROGRESS",
  });

  const navigate = useNavigate();

  async function fetchusersdata() {
    try {
      const users = await fetch("http://localhost:3000/api/users/allusers");
      const usersdata = await users.json();
      const cleaners = usersdata.filter((user) => user.role === "cleaner");
      setCleanerslist(cleaners);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  async function allcleanings() {
    try {
      const fetchdata = await fetch(
        "http://localhost:3000/api/cleanings/allcleanings",
      );
      const res = await fetchdata.json();
      setCleaningList(res);
    } catch (err) {
      console.error("Error fetching cleanings:", err);
    }
  }

  async function startCleaning(roomNo) {
    // console.log("Clean start data:", cleanStart);
    try {
      const userdata = JSON.parse(localStorage.getItem("userdata")) || {};
      const token = userdata.token;
      const res = await fetch(
        `http://localhost:3000/api/cleanings/startcleaning/${roomNo}`,
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
        // // console.log("Cleaning started successfully:", data);
        allcleanings();
      } else {
        console.error("Error starting cleaning:", data.message);
      }
    } catch (err) {
      console.error("Error starting cleaning:", err);
    }
  }

  async function completeCleaning(roomNo) {
    try {
      const userdata = JSON.parse(localStorage.getItem("userdata")) || {};
      const token = userdata.token;
      const res = await fetch(
        `http://localhost:3000/api/cleanings/completecleaning/${roomNo}`,
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
        // console.log("Cleaning completed successfully:", data);
        allcleanings();
      } else {
        console.error("Error completing cleaning:", data.message);
      }
    } catch (err) {
      console.error("Error completing cleaning:", err);
    }
  }

  useEffect(() => {
    async function init() {
      const result = await verifyToken();
      if (!result.ok) {
        // token invalid or missing -> redirect to login
        return navigate("/login");
      }
      fetchusersdata();
      allcleanings();
    }
    init();
  }, []);

  return (
    <>
      <div className="housekeeping-header">
        <div>
          <h1 className="housekeeping-title">Housekeeping</h1>
          <p className="housekeeping-subtitle">
            Track cleaning status and assign cleaners.
          </p>
        </div>
        <div className="housekeeping-badge">
          <i className="fas fa-user-hard-hat"></i>
          Cleaners: {cleanerslist.length}
        </div>
      </div>

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
            {Array.isArray(cleaningList) && cleaningList.length > 0 ? (
              cleaningList.map((cleaning, index) => (
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
