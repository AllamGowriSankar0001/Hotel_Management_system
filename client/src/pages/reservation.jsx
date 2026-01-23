import { useState, useEffect } from "react";
import "../App.css";
import { useLocation } from "react-router-dom";

function Reservation() {
  const location = useLocation();
  // Get room number from navigation state if coming from rooms page
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
  const [showForm, setShowForm] = useState(roomNoFromRooms ? true : false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stayFilter, setStayFilter] = useState("all");
  const [guestNameFilter, setGuestNameFilter] = useState("");
  const [checkInDateFilter, setCheckInDateFilter] = useState("");

  // Fetches all reservations from the API
  async function fetchreservation() {
    try {
      const reservationres = await fetch(
        "https://hotel-management-system-2spj.onrender.com/api/reservations/getallreservations"
      );
      const reservationdata = await reservationres.json();
      setReservations(reservationdata.Allreservation);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  }
  
  // Handles the checkout process for a reservation by room number
  async function checkoutReservation(roomNo) {
    try {
      const res = await fetch(`https://hotel-management-system-2spj.onrender.com/api/reservations/checkout/${roomNo}`,
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

  // Updates reservation form fields as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submits the reservation form and creates a new reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `https://hotel-management-system-2spj.onrender.com/api/reservations/roomreservation/${reservation.roomNo}`,
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
      fetchreservation();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically show form if room number is provided from navigation
  useEffect(() => {
    if (roomNoFromRooms) {
      setShowForm(true);
    }
  }, [roomNoFromRooms]);

  // Automatically hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetches reservations on mount and calculates checkout date based on stay duration
  useEffect(() => {
    fetchreservation();
    if (!reservation.checkInDate || !reservation.StayTime) return;

    const checkIn = new Date(reservation.checkInDate);
    let checkOut = new Date(checkIn);
    const baseCharge = 500;

    if (reservation.StayTime === "12h") {
      checkOut.setHours(checkOut.getHours() + 12);
    } else if (reservation.StayTime === "24h") {
      checkOut.setHours(checkOut.getHours() + 24);
    } else if (
      reservation.StayTime === "custom" &&
      reservation.customHours > 0
    ) {
      checkOut.setHours(checkOut.getHours() + Number(reservation.customHours));
    }

    setReservation((prev) => ({
      ...prev,
      checkOutDate: checkOut.toISOString().slice(0, 16),
    }));
  }, [reservation.checkInDate, reservation.StayTime, reservation.customHours]);
  
  // Filters reservations based on search and filter criteria
  const filteredReservations = reservations.filter((reserv) => {
    const matchesSearch =
      reserv.guestPhone?.includes(search) ||
      reserv.roomNo?.toString().includes(search);

    const matchesGuestName = guestNameFilter === "" || 
      reserv.guestName?.toLowerCase().includes(guestNameFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || reserv.status === statusFilter;

    const matchesStay =
      stayFilter === "all" || reserv.StayTime === stayFilter;

    const matchesCheckInDate = checkInDateFilter === "" || 
      (reserv.checkInDate && new Date(reserv.checkInDate).toISOString().split('T')[0] === checkInDateFilter);

    return matchesSearch && matchesGuestName && matchesStatus && matchesStay && matchesCheckInDate;
  });

  return (
    <>
      {loading && <p className="reservation-message">Processing...</p>}
      {error && <p className="reservation-error">{error}</p>}
      {success && (
        <div className="reservation-success">
          <i className="fas fa-check-circle"></i>
          <span>Reservation successful</span>
        </div>
      )}
      
      <div className="reservation-header">
        <div>
          <h1 className="reservation-title">Reservation</h1>
          <p className="reservation-subtitle">
            Enter guest details and confirm their stay.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="reservation-toggle-btn"
            style={{
              background: showForm ? "#000000" : "#ffffff",
              color: showForm ? "#ffffff" : "#374151",
              borderColor: showForm ? "#000000" : "#000000",
            }}
          >
            <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
            {showForm ? "Hide" : "New"}
          </button>
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
        </div>
      </div>
      
      {showForm && (
        <div className="reservation-form-container-single">
          <form className="guest-form" onSubmit={handleSubmit}>
          <div className="guest-form-header">
            <h2 className="guest-form-title">New Reservation</h2>
            <p className="guest-form-subtitle">Enter guest details to create a new reservation</p>
          </div>
          
          <div className="guest-form-fields">
            <label>
              <span className="guest-form-label-text">Guest Name</span>
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
              <span className="guest-form-label-text">Phone Number</span>
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
              <span className="guest-form-label-text">Check-In Date</span>
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
              <span className="guest-form-label-text">Check-Out Date (auto-calculated)</span>
              <input
                type="datetime-local"
                name="checkOutDate"
                placeholder="Check-Out Date"
                value={reservation.checkOutDate}
                readOnly
              />
            </label>

            <label>
              <span className="guest-form-label-text">Stay Duration</span>
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

            <label>
              <span className="guest-form-label-text">Room Number</span>
              <input
                type="text"
                name="roomNo"
                placeholder="Enter Room Number"
                required
                value={reservation.roomNo}
                onChange={handleChange}
              />
            </label>

            {reservation.StayTime === "custom" && (
              <label>
                <span className="guest-form-label-text">Custom Hours</span>
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
          </div>

          <button type="submit" className="guest-form-submit-btn">
            <i className="fas fa-check-circle"></i>
            Confirm Reservation
          </button>
        </form>
        </div>
      )}

      {showFilter && (
        <div className="reservation-filter-container-single">
          <div className="reservation-filter-box">
            <div className="reservation-filter-header">
              <h2 className="reservation-filter-title">Filter & Search</h2>
              <p className="reservation-filter-subtitle">Search and filter reservations</p>
            </div>
            
            <div className="reservation-filter-content">
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-user reservation-filter-icon"></i>
                  <input
                    type="text"
                    className="reservation-search-input"
                    placeholder="Search by guest name"
                    value={guestNameFilter}
                    onChange={(e) => setGuestNameFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-calendar reservation-filter-icon"></i>
                  <input
                    type="date"
                    className="reservation-search-input"
                    placeholder="Check-in Date"
                    value={checkInDateFilter}
                    onChange={(e) => setCheckInDateFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-filter reservation-filter-icon"></i>
                  <select
                    className="reservation-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="CHECKED_OUT">Checked Out</option>
                  </select>
                </div>
              </div>
              
              <div className="reservation-filter-section">
                <div className="reservation-filter-input-wrapper">
                  <i className="fas fa-search reservation-filter-icon"></i>
                  <input
                    type="text"
                    className="reservation-search-input"
                    placeholder="Search by room, phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <span className="reservation-stay-badge">
                      {reserv.StayTime === "custom" && reserv.customHours 
                        ? `${reserv.customHours}h`
                        : reserv.StayTime}
                    </span>
                  </td>
                  <td>
                    <span className="reservation-charge">{reserv.charge || 0}₹</span>
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
