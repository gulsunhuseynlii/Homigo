import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/authService";
import { saveToken } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form);

      
      saveToken(response.data.token);

      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
  console.log(error.response?.status);
  console.log(error.response?.data);

  toast.error(
    typeof error.response?.data === "string"
      ? error.response.data
      : error.response?.data?.message || "Login failed."
  );
}
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
      }}
    >
      <h2>Login</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;