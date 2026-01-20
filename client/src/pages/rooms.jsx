import useFetch from "../components/fetch";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";

function Rooms() {
  const [roomsByFloor, setRoomsByFloor] = useState({});
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
        </div>
      </div>

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
                    style={roomCardStyle}
                  >
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
