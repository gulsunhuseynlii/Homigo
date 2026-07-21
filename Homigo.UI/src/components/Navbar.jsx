import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#2E86DE",
      }}
    >
      <h2 style={{ color: "white" }}>Homigo</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;