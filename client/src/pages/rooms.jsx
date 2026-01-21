import useFetch from "../components/fetch";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

function Rooms() {
  const [roomsByFloor, setRoomsByFloor] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [floorInput, setFloorInput] = useState("");
  const [roomNoInput, setRoomNoInput] = useState("");
  const [roomTypeInput, setRoomTypeInput] = useState("single");
  const [statusInput, setStatusInput] = useState("available");
  const [submitting, setSubmitting] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [originalRoomNo, setOriginalRoomNo] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const navigate = useNavigate();

  const { data, error, loading } = useFetch(
    "https://hotel-management-system-2spj.onrender.com/api/rooms/allfloors"
  );
  
  useEffect(() => {
    async function fetchRooms() {
      if (!data) return;

      const allRooms = {};
      for (let floor of data) {
        const res = await fetch(
          `https://hotel-management-system-2spj.onrender.com/api/rooms/floor/${floor}`
        );
        const rooms = await res.json();
        allRooms[floor] = rooms;
      }
      setRoomsByFloor(allRooms);
    }
    fetchRooms();
  }, [data]);

  async function refreshRooms() {
    if (!data) return;
    const allRooms = {};
    for (let floor of data) {
      const res = await fetch(
        `https://hotel-management-system-2spj.onrender.com/api/rooms/floor/${floor}`
      );
      const rooms = await res.json();
      allRooms[floor] = rooms;
    }
    setRoomsByFloor(allRooms);
  }

  if (loading) return <p className="loading-text">Loading rooms…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <div className="rooms-header">
        <div>
          <h1 className="rooms-title">Rooms</h1>
          <p className="rooms-subtitle">
            Click an available room to start a reservation.
          </p>
        </div>
        <div className="rooms-badges">
          <span className="room-badge">
            <span className="room-badge-dot" style={{ background: "#4caf50" }}></span>
            Available
          </span>
          <span className="room-badge">
            <span className="room-badge-dot" style={{ background: "#f44336" }}></span>
            Occupied
          </span>
          <span className="room-badge">
            <span className="room-badge-dot" style={{ background: "#000" }}></span>
            Cleaning
          </span>
          <button
            style={{ marginLeft: "12px", marginTop: 0 }}
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            <i
              className={`fa-solid ${showAddForm ? "fa-times" : "fa-plus"}`}
              style={{ marginRight: "5px" }}
            >
              {" "}
            </i>{" "}
            {showAddForm ? "Close" : "Add Room"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="user-form-card">
          <h2>Add Room</h2>

          <div className="user-form-grid">
            <input
              type="text"
              placeholder="Floor (e.g., 1)"
              value={floorInput}
              onChange={(e) => setFloorInput(e.target.value)}
            />

            <input
              type="text"
              placeholder="Room Number (e.g., 101)"
              value={roomNoInput}
              onChange={(e) => setRoomNoInput(e.target.value)}
            />

            <select
              value={roomTypeInput}
              onChange={(e) => setRoomTypeInput(e.target.value)}
              className="user-form-select"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>

            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="user-form-select"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning_needed">Cleaning Needed</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>

          <button
            className="create-user-btn"
            disabled={submitting}
            onClick={async () => {
              if (!floorInput || !roomNoInput || !roomTypeInput) return;
              try {
                setSubmitting(true);
                const res = await fetch(
                  "https://hotel-management-system-2spj.onrender.com/api/rooms/createrooms",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      floor: floorInput,
                      rooms: [
                        {
                          roomNo: roomNoInput,
                          roomType: roomTypeInput,
                          status: statusInput || "available",
                        },
                      ],
                    }),
                  }
                );

                if (!res.ok) {
                  const err = await res.json().catch(() => ({ message: "Failed to add room" }));
                  alert(err.message || "Failed to add room");
                  return;
                }

                // If the new floor already exists, we can refresh in-place.
                // If it's a brand new floor, refresh is easiest (floors list comes from another request).
                const floorExists = Array.isArray(data) && data.includes(floorInput);
                if (floorExists) {
                  await refreshRooms();
                } else {
                  window.location.reload();
                }

                setFloorInput("");
                setRoomNoInput("");
                setRoomTypeInput("single");
                setStatusInput("available");
                setShowAddForm(false);
              } catch (err) {
                console.error(err);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? "Adding..." : "Add Room"}
          </button>
        </div>
      )}

      {editingRoom && (
        <div className="user-form-card">
          <h2>Update Room</h2>

          <div className="user-form-grid">
            <input
              type="number"
              placeholder="Floor"
              value={editingRoom.floor}
              onChange={(e) =>
                setEditingRoom((prev) => ({
                  ...prev,
                  floor: parseInt(e.target.value) || prev.floor,
                }))
              }
            />

            <input
              type="text"
              placeholder="Room Number"
              value={editingRoom.roomNo}
              onChange={(e) =>
                setEditingRoom((prev) => ({
                  ...prev,
                  roomNo: e.target.value,
                }))
              }
            />

            <select
              value={editingRoom.roomType}
              onChange={(e) =>
                setEditingRoom((prev) => ({
                  ...prev,
                  roomType: e.target.value,
                }))
              }
              className="user-form-select"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>

            <select
              value={editingRoom.status}
              onChange={(e) =>
                setEditingRoom((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="user-form-select"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning_needed">Cleaning Needed</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="create-user-btn"
              disabled={editSubmitting}
              onClick={async () => {
                try {
                  setEditSubmitting(true);
                  const res = await fetch(
                    `https://hotel-management-system-2spj.onrender.com/api/rooms/updateroom/${originalRoomNo}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        floor: editingRoom.floor,
                        roomNo: editingRoom.roomNo,
                        roomType: editingRoom.roomType,
                        status: editingRoom.status,
                      }),
                    }
                  );

                  if (!res.ok) {
                    const err = await res.json().catch(() => ({ message: "Failed to update room" }));
                    alert(err.message || "Failed to update room");
                    return;
                  }

                  await refreshRooms();
                  setEditingRoom(null);
                  setOriginalRoomNo(null);
                } catch (err) {
                  console.error(err);
                  alert("Error updating room: " + err.message);
                } finally {
                  setEditSubmitting(false);
                }
              }}
            >
              {editSubmitting ? "Updating..." : "Update Room"}
            </button>

            <button className="action-button" onClick={() => {
              setEditingRoom(null);
              setOriginalRoomNo(null);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="rooms-floor-list">
        {data.map((floor, index) => (
          <li className="rooms-floor-item" key={index}>
            <h2 className="rooms-floor-title">Floor {floor}</h2>
            <hr />
            <ul className="room-list">
              {roomsByFloor[floor]?.map((room, idx) => {
                const roomCardStyle = room.roomType === "suite" 
                  ? {
                      backgroundColor: "rgba(255, 215, 0, 0.12)",
                      border: "1px solid #e0b300",
                      boxShadow: "0 6px 18px rgba(224,179,0,0.25)",
                      cursor: room.status === "occupied" ? "not-allowed" : "pointer",
                    }
                  : room.roomType === "double"
                  ? {
                      backgroundColor: "rgba(0, 102, 255, 0.12)",
                      border: "1px solid #2b6cff",
                      boxShadow: "0 6px 18px rgba(43,108,255,0.25)",
                      cursor: room.status === "occupied" ? "not-allowed" : "pointer",
                    }
                  : {
                      backgroundColor: "rgba(80,80,80,0.12)",
                      border: "1px solid #777",
                      boxShadow: "0 6px 18px rgba(80,80,80,0.25)",
                      cursor: room.status === "occupied" ? "not-allowed" : "pointer",
                    };

                const roomTypeColor = room.roomType === "suite" ? "#e0b300" 
                  : room.roomType === "double" ? "#2b6cff" 
                  : "#555";

                return (
                  <li
                    key={idx}
                    className="roomcard"
                    onClick={() => {
                      if (room.status !== "occupied") {
                        navigate("/reservation", {
                          state: { roomNo: room.roomNo },
                        });
                      }
                    }}
                    style={{ ...roomCardStyle, position: "relative" }}
                  >
                    <button
                      type="button"
                      className="room-edit-btn"
                      aria-label={`Edit room ${room.roomNo}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOriginalRoomNo(room.roomNo);
                        setEditingRoom({
                          floor,
                          roomNo: room.roomNo,
                          roomType: room.roomType,
                          status: room.status,
                        });
                        setShowAddForm(false);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    <h4>{room.roomNo}</h4>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      width: "80px",
                      marginTop: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <span
                        className="room-tag filled"
                        style={{
                          color: "#fff",
                          borderColor: roomTypeColor,
                          background: roomTypeColor,
                        }}
                      >
                        {room.roomType.toUpperCase()}
                      </span>
                      {room.status === "occupied" ? (
                        <span
                          className="room-tag"
                          style={{
                            backgroundColor: "#f44336",
                            borderColor: "#f44336",
                            color: "#fff",
                          }}
                        >
                          Occupied
                        </span>
                      ) : room.status === "cleaning_needed" ? (
                        <span
                          className="room-tag"
                          style={{
                            backgroundColor: "#000",
                            borderColor: "#000",
                            color: "#fff",
                          }}
                        >
                          Need Cleaning
                        </span>
                      ) : room.status === "under_maintenance" ? (

                        <span
                          className="room-tag"
                          style={{
                            backgroundColor: "#fb591ed8",
                            borderColor: "#ff4500",
                            color: "#ffffff",
                          }}
                        >
                          Cleaning In Progress
                        </span>
                      ):(
                        <span
                          className="room-tag"
                          style={{
                            backgroundColor: "#4caf50",
                            borderColor: "#4caf50",
                            color: "#fff",
                          }}
                        >
                          Available
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;
