import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "../App.css";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
