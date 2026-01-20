import { useState, useEffect } from "react";
import "../App.css";
import { useLocation } from "react-router-dom";

function Reservation() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stayFilter, setStayFilter] = useState("all");
  const location = useLocation();
  const roomNoFromRooms = location.state?.roomNo || "";

  const today = new Date().toISOString().slice(0, 16);
  const [reservation, setReservation] = useState({
    guestName: "",
    guestPhone: "",
    StayTime: "",
    customHours: 0,
    roomNo: roomNoFromRooms || "",
    checkInDate: today,
    checkOutDate: "",
    status: "CHECKED_IN",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservations, setReservations] = useState([]);

  async function fetchreservation() {
    try {
      const reservationres = await fetch(
        "http://localhost:3000/api/reservations/getallreservations"
      );
      const reservationdata = await reservationres.json();
      setReservations(reservationdata.Allreservation);
    } catch (err) {
      // console.log(err);
    }
  }
  
  async function checkoutReservation(roomNo) {
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/checkout/${roomNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Checkout failed");
      }

      const data = await res.json();
      fetchreservation();
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  }

  useEffect(() => {
    fetchreservation();
    if (!reservation.checkInDate || !reservation.StayTime) return;

    const checkIn = new Date(reservation.checkInDate);
    let checkOut = new Date(checkIn);
    let charge = 0;
    const baseCharge = 500;

    if (reservation.StayTime === "12h") {
      checkOut.setHours(checkOut.getHours() + 12);
      charge = baseCharge + baseCharge * 0.18;
    } else if (reservation.StayTime === "24h") {
      checkOut.setHours(checkOut.getHours() + 24);
      charge = baseCharge * 2 + baseCharge * 0.18;
    } else if (
      reservation.StayTime === "custom" &&
      reservation.customHours > 0
    ) {
      checkOut.setHours(checkOut.getHours() + Number(reservation.customHours));
      charge =
        baseCharge * (Number(reservation.customHours) / 12) + baseCharge * 0.18;
    }

    setReservation((prev) => ({
      ...prev,
      checkOutDate: checkOut.toISOString().slice(0, 16),
    }));
  }, [reservation.checkInDate, reservation.StayTime, reservation.customHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `http://localhost:3000/api/reservations/roomreservation/${reservation.roomNo}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservation),
        }
      );

      if (!res.ok) throw new Error("Reservation failed");

      setSuccess(true);
      setReservation({
        guestName: "",
        guestPhone: "",
        StayTime: "",
        customHours: 0,
        roomNo: "",
        checkInDate: today,
        checkOutDate: "",
        status: "CHECKED_IN",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredReservations = reservations.filter((reserv) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      reserv.guestName?.toLowerCase().includes(searchValue) ||
      reserv.guestPhone?.includes(search) ||
      reserv.roomNo?.toString().includes(search) ||
      reserv.status?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || reserv.status === statusFilter;

    const matchesStay =
      stayFilter === "all" || reserv.StayTime === stayFilter;

    return matchesSearch && matchesStatus && matchesStay;
  });

  return (
    <>
      {loading && <p className="reservation-message">Processing...</p>}
      {error && <p className="reservation-error">{error}</p>}
      {success && <p className="reservation-success">Reservation successful ✅</p>}
      
      <div className="reservation-header">
        <div>
          <h1 className="reservation-title">Reservation</h1>
          <p className="reservation-subtitle">
            Enter guest details and confirm their stay.
          </p>
        </div>
        <div className="reservation-status-pills">
          <span className="status-pill" style={{ color: "#4caf50", borderColor: "#4caf50" }}>
            <span className="status-pill-dot" style={{ background: "#4caf50" }}></span>
            Checked In
          </span>
          <span className="status-pill" style={{ color: "#f44336", borderColor: "#f44336" }}>
            <span className="status-pill-dot" style={{ background: "#f44336" }}></span>
            Checked Out
          </span>
        </div>
      </div>
      
      <div className="reservation-filter-container">
        <form className="guest-form" onSubmit={handleSubmit}>
          <label>
            Guest Name
            <input
              type="text"
              name="guestName"
              placeholder="Enter Guest Name"
              required
              value={reservation.guestName}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="guestPhone"
              placeholder="Enter Phone Number (e.g., +1234567890)"
              required
              value={reservation.guestPhone}
              onChange={handleChange}
            />
          </label>

          <label>
            Check-In Date
            <input
              type="datetime-local"
              name="checkInDate"
              placeholder="Select Check-In Date and Time"
              required
              value={reservation.checkInDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Check-Out Date (auto-calculated)
            <input
              type="datetime-local"
              name="checkOutDate"
              placeholder="Check-Out Date"
              value={reservation.checkOutDate}
              readOnly
            />
          </label>

          <label>
            Stay Duration
            <select
              name="StayTime"
              required
              value={reservation.StayTime}
              onChange={handleChange}
            >
              <option value="">Select Stay Duration</option>
              <option value="12h">12 Hours</option>
              <option value="24h">24 Hours</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          {reservation.StayTime === "custom" && (
            <label>
              Custom Hours
              <input
                type="number"
                name="customHours"
                min="1"
                placeholder="Enter number of hours for Custom Stay"
                value={reservation.customHours}
                onChange={handleChange}
              />
            </label>
          )}

          <label>
            Room Number
            <input
              type="text"
              name="roomNo"
              placeholder="Enter Room Number"
              required
              value={reservation.roomNo}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Confirm Reservation</button>
        </form>
        
        <div className="guest-form">
          
          <div className="reservation-filter-row">
          <h1>Filtered Search</h1>
            <div className="reservation-filter-section">
              <input
            type="text"
            className="reservation-search-input"
            placeholder="Search by guest, room, phone or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
              <label className="reservation-filter-label">Status</label>
              <select
                className="reservation-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CHECKED_OUT">Checked Out</option>
              </select>
            </div>
            <div className="reservation-filter-section">
              <label className="reservation-filter-label">Stay Duration</label>
              <select
                className="reservation-filter-select"
                value={stayFilter}
                onChange={(e) => setStayFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="12h">12 Hours</option>
                <option value="24h">24 Hours</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="professional-table-container">
        <table className="professional-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Phone</th>
              <th>Check-In</th>
              <th>Status</th>
              <th>Stay Time</th>
              <th>Charge</th>
              <th>Room No</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reservations) && filteredReservations.length > 0 ? (
              filteredReservations.map((reserv, index) => (
                <tr key={reserv._id || index} className="reservation-table-row">
                  <td>
                    <span className="reservation-guest-name">{reserv.guestName}</span>
                  </td>
                  <td>{reserv.guestPhone}</td>
                  <td>
                    {reserv.checkInDate
                      ? new Date(reserv.checkInDate).toLocaleString()
                      : "--"}
                  </td>
                  <td>
                    {reserv.status === "CHECKED_IN" ? (
                      <span className="reservation-status-badge checked-in">
                        <i className="fas fa-check-circle" style={{ fontSize: "10px" }}></i>
                        {reserv.status.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="reservation-status-badge checked-out">
                        <i className="fas fa-times-circle" style={{ fontSize: "10px" }}></i>
                        {reserv.status.replace("_", " ")}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="reservation-stay-badge">{reserv.StayTime}</span>
                  </td>
                  <td>
                    <span className="reservation-charge">${reserv.charge || 0}</span>
                  </td>
                  <td>
                    <span className="reservation-room-badge">{reserv.roomNo}</span>
                  </td>
                  <td>
                    {reserv.status === "CHECKED_IN" ? (
                      <button
                        type="button"
                        onClick={() => checkoutReservation(reserv.roomNo)}
                        className="checkout-button"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Check Out
                      </button>
                    ) : (
                      <span className="reservation-checked-out-text">Checked Out</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Reservation;
