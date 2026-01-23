import useFetch from "../components/fetch";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState, useRef } from "react";
import { Pencil } from "lucide-react";

function Rooms() {
  const navigate = useNavigate();
  
  // Refs for scrolling to edit forms when they appear
  const editRoomFormRef = useRef(null);
  const editFloorFormRef = useRef(null);

  // Fetch all floor numbers from the API
  const { data, error, loading } = useFetch(
    "https://hotel-management-system-2spj.onrender.com/api/rooms/allfloors"
  );

  // State for managing rooms organized by floor
  const [roomsByFloor, setRoomsByFloor] = useState({});
  // State for showing/hiding the add room form
  const [showAddForm, setShowAddForm] = useState(false);
  // State for the floor number input when adding rooms
  const [floorInput, setFloorInput] = useState("");
  // State for managing multiple room entries in the add form
  const [roomEntries, setRoomEntries] = useState([
    { roomNo: "", roomType: "single", status: "available" }
  ]);
  // State for tracking form submission status
  const [submitting, setSubmitting] = useState(false);
  // State for the room currently being edited
  const [editingRoom, setEditingRoom] = useState(null);
  // Store the original room number before editing (in case it changes)
  const [originalRoomNo, setOriginalRoomNo] = useState(null);
  // State for tracking room update submission
  const [editSubmitting, setEditSubmitting] = useState(false);
  // State for tracking room deletion process
  const [deletingRoom, setDeletingRoom] = useState(false);
  // State for the floor currently being edited
  const [editingFloor, setEditingFloor] = useState(null);
  // State for tracking which rooms are selected for bulk deletion
  const [selectedRooms, setSelectedRooms] = useState([]);
  // State for tracking floor deletion submission
  const [floorDeleteSubmitting, setFloorDeleteSubmitting] = useState(false);

  // Refreshes the rooms data by fetching all rooms for each floor
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

  // Fetch all rooms for each floor when floor data is available
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

  // Auto-scroll to room edit form when it appears
  useEffect(() => {
    if (editingRoom && editRoomFormRef.current) {
      editRoomFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [editingRoom]);

  // Auto-scroll to floor edit form when it appears
  useEffect(() => {
    if (editingFloor && editFloorFormRef.current) {
      editFloorFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [editingFloor]);

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
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="reservation-toggle-btn"
            style={{
              background: showAddForm ? "#000000" : "#ffffff",
              color: showAddForm ? "#ffffff" : "#374151",
              borderColor: showAddForm ? "#000000" : "#000000",
              padding: "6px 12px",
              fontSize: "12px",
              height: "auto",
              lineHeight: "1.5",
              marginTop: "0px",
              borderRadius: "50px",
            }}
          >
            <i className={`fa-solid ${showAddForm ? "fa-times" : "fa-plus"}`}></i>
            {showAddForm ? "Hide" : "Add Room"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="user-form-card">
          <h2>Add Rooms</h2>

          <div className="user-form-grid" style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Floor (e.g., 1)"
              value={floorInput}
              onChange={(e) => setFloorInput(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#374151" }}>Room Details</h3>
              <button
                type="button"
                onClick={() => {
                  setRoomEntries([...roomEntries, { roomNo: "", roomType: "single", status: "available" }]);
                }}
                className="reservation-toggle-btn"
                style={{
                  background: "#000000",
                  color: "#ffffff",
                  borderColor: "#000000",
                }}
              >
                <i className="fas fa-plus"></i>
                Add Another Room
              </button>
            </div>

            {roomEntries.map((room, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  marginBottom: "16px",
                  background: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Room {index + 1}</span>
                  {roomEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoomEntries(roomEntries.filter((_, i) => i !== index));
                      }}
                      className="reservation-toggle-btn"
                      style={{
                        background: "#ffffff",
                        color: "#ef4444",
                        borderColor: "#ef4444",
                      }}
                    >
                      <i className="fas fa-trash" style={{ color: "#ef4444" }}></i> Remove
                    </button>
                  )}
                </div>

                <div className="user-form-grid">
                  <input
                    type="text"
                    placeholder="Room Number (e.g., 101)"
                    value={room.roomNo}
                    onChange={(e) => {
                      const updated = [...roomEntries];
                      updated[index].roomNo = e.target.value;
                      setRoomEntries(updated);
                    }}
                  />

                  <select
                    value={room.roomType}
                    onChange={(e) => {
                      const updated = [...roomEntries];
                      updated[index].roomType = e.target.value;
                      setRoomEntries(updated);
                    }}
                    className="user-form-select"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>

                  <select
                    value={room.status}
                    onChange={(e) => {
                      const updated = [...roomEntries];
                      updated[index].status = e.target.value;
                      setRoomEntries(updated);
                    }}
                    className="user-form-select"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning_needed">Cleaning Needed</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            className="create-user-btn"
            disabled={submitting}
            onClick={async () => {
              if (!floorInput) {
                alert("Please enter a floor number");
                return;
              }
              
              const validRooms = roomEntries.filter(room => room.roomNo && room.roomType);
              if (validRooms.length === 0) {
                alert("Please add at least one room with a room number");
                return;
              }

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
                      rooms: validRooms.map(room => ({
                        roomNo: room.roomNo,
                        roomType: room.roomType,
                        status: room.status || "available",
                      })),
                    }),
                  }
                );

                if (!res.ok) {
                  const err = await res.json().catch(() => ({ message: "Failed to add rooms" }));
                  alert(err.message || "Failed to add rooms");
                  return;
                }

                const floorExists = Array.isArray(data) && data.includes(floorInput);
                if (floorExists) {
                  await refreshRooms();
                } else {
                  window.location.reload();
                }

                setFloorInput("");
                setRoomEntries([{ roomNo: "", roomType: "single", status: "available" }]);
                setShowAddForm(false);
              } catch (err) {
                console.error(err);
                alert("Error adding rooms: " + err.message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? `Adding ${roomEntries.length} Room(s)...` : `Add ${roomEntries.length} Room(s)`}
          </button>
        </div>
      )}

      {editingRoom && (
        <div className="user-form-card" ref={editRoomFormRef}>
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
              style={{ padding: "8px 16px", fontSize: "14px" }}
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

            <button
              type="button"
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#ef4444",
                borderColor: "#ef4444",
                padding: "0px",
                fontSize: "14px",

                marginTop: "25px",
              }}
              disabled={deletingRoom}
              onClick={async () => {
                if (!window.confirm(`Are you sure you want to delete room ${originalRoomNo}?`)) {
                  return;
                }
                try {
                  setDeletingRoom(true);
                  const res = await fetch(
                    `https://hotel-management-system-2spj.onrender.com/api/rooms/deleteroom/${originalRoomNo}`,
                    {
                      method: "DELETE",
                    }
                  );

                  if (!res.ok) {
                    const err = await res.json().catch(() => ({ message: "Failed to delete room" }));
                    alert(err.message || "Failed to delete room");
                    return;
                  }

                  await refreshRooms();
                  setEditingRoom(null);
                  setOriginalRoomNo(null);
                  alert("Room deleted successfully");
                } catch (err) {
                  console.error(err);
                  alert("Error deleting room: " + err.message);
                } finally {
                  setDeletingRoom(false);
                }
              }}
            >
              <i className="fas fa-trash" style={{ color: "#ef4444" }}></i>
              <span style={{ color: "#ef4444" }}>{deletingRoom ? "Deleting..." : "Delete"}</span>
            </button>

            <button 
              type="button"
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#ef4444",
                borderColor: "#ef4444",
                padding: "0px",
                fontSize: "14px",
                marginTop: "25px",

              }}
              onClick={() => {
                setEditingRoom(null);
                setOriginalRoomNo(null);
              }}
            >
              <i className="fas fa-times" style={{ color: "#ef4444" }}></i>
              <span style={{ color: "#ef4444" }}>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {editingFloor && (
        <div className="user-form-card" ref={editFloorFormRef}>
          <h2>Edit Floor {editingFloor}</h2>
          <p style={{ marginBottom: "20px", color: "#6b7280", fontSize: "14px" }}>
            Select rooms to delete from this floor
          </p>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
            gap: "12px",
            marginBottom: "20px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "12px",
            background: "#f9fafb",
            borderRadius: "8px"
          }}>
            {roomsByFloor[editingFloor]?.map((room) => (
              <div
                key={room.roomNo}
                onClick={() => {
                  if (selectedRooms.includes(room.roomNo)) {
                    setSelectedRooms(selectedRooms.filter(r => r !== room.roomNo));
                  } else {
                    setSelectedRooms([...selectedRooms, room.roomNo]);
                  }
                }}
                style={{
                  padding: "12px",
                  border: selectedRooms.includes(room.roomNo) 
                    ? "2px solid #2563eb" 
                    : "2px solid #d1d5db",
                  borderRadius: "8px",
                  background: selectedRooms.includes(room.roomNo) 
                    ? "#eff6ff" 
                    : "#ffffff",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "4px", color: "#000000" }}>{room.roomNo}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{room.roomType}</div>
                {selectedRooms.includes(room.roomNo) && (
                  <i className="fas fa-check-circle" style={{ color: "#2563eb", marginTop: "4px" }}></i>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#ef4444",
                borderColor: "#ef4444",
              }}
              disabled={selectedRooms.length === 0 || floorDeleteSubmitting}
              onClick={async () => {
                if (selectedRooms.length === 0) {
                  alert("Please select at least one room to delete");
                  return;
                }
                if (!window.confirm(`Are you sure you want to delete ${selectedRooms.length} room(s)?`)) {
                  return;
                }
                try {
                  setFloorDeleteSubmitting(true);
                  const res = await fetch(
                    "https://hotel-management-system-2spj.onrender.com/api/rooms/deleterooms",
                    {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ roomNos: selectedRooms }),
                    }
                  );

                  if (!res.ok) {
                    const err = await res.json().catch(() => ({ message: "Failed to delete rooms" }));
                    alert(err.message || "Failed to delete rooms");
                    return;
                  }

                  await refreshRooms();
                  setEditingFloor(null);
                  setSelectedRooms([]);
                  alert(`${selectedRooms.length} room(s) deleted successfully`);
                } catch (err) {
                  console.error(err);
                  alert("Error deleting rooms: " + err.message);
                } finally {
                  setFloorDeleteSubmitting(false);
                }
              }}
            >
              <i className="fas fa-trash" style={{ color: "#ef4444" }}></i>
              <span style={{ color: "#ef4444" }}>{floorDeleteSubmitting ? "Deleting..." : `Delete ${selectedRooms.length} Room(s)`}</span>
            </button>

            <button
              type="button"
              className="reservation-toggle-btn"
              style={{
                background: "#ffffff",
                color: "#ef4444",
                borderColor: "#ef4444",
              }}
              onClick={() => {
                setEditingFloor(null);
                setSelectedRooms([]);
              }}
            >
              <i className="fas fa-times" style={{ color: "#ef4444" }}></i>
              <span style={{ color: "#ef4444" }}>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <ul className="rooms-floor-list">
        {data.map((floor, index) => (
          <li className="rooms-floor-item" key={index}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 className="rooms-floor-title" style={{ margin: 0 }}>Floor {floor}</h2>
              <div style={{ display: "flex", gap: "8px" }}>
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
                  onClick={() => {
                    setEditingFloor(floor);
                    setSelectedRooms([]);
                    setShowAddForm(false);
                    setEditingRoom(null);
                  }}
                >
                  <i className="fas fa-edit" style={{ color: "#01cc01" }}></i>
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
                  onClick={async () => {
                    if (!window.confirm(`Are you sure you want to delete entire Floor ${floor}? This will delete all rooms on this floor.`)) {
                      return;
                    }
                    try {
                      const res = await fetch(
                        `https://hotel-management-system-2spj.onrender.com/api/rooms/deletefloor/${floor}`,
                        {
                          method: "DELETE",
                        }
                      );

                      if (!res.ok) {
                        const err = await res.json().catch(() => ({ message: "Failed to delete floor" }));
                        alert(err.message || "Failed to delete floor");
                        return;
                      }

                      const result = await res.json();
                      await refreshRooms();
                      window.location.reload();
                      alert(result.message);
                    } catch (err) {
                      console.error(err);
                      alert("Error deleting floor: " + err.message);
                    }
                  }}
                >
                  <i className="fas fa-trash" style={{ color: "#ef4444" }}></i>
                </button>
              </div>
            </div>
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
