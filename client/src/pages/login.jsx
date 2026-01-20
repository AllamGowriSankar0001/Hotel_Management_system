import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();
    localStorage.setItem("userdata", JSON.stringify(data));
    const userdata = JSON.parse(localStorage.getItem("userdata"))

    navigate('/dashboard');


  }

  return (
    <div className="container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="form-header">
            <p className="welcome-text">WELCOME BACK</p>
            <h2>Sign In</h2>
            <p className="login-subtitle">
              Access your dashboard and manage hotel operations.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
