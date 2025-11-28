import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 10 * 60 * 1000; // 10 minutes

  const storedAttempts = Number(localStorage.getItem("admin_attempts") || 0);
  const lockUntil = Number(localStorage.getItem("admin_lock_until") || 0);

  const isLocked = Date.now() < lockUntil;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      const minutes = Math.ceil((lockUntil - Date.now()) / 60000);
      setError(`Too many attempts. Try again after ${minutes} minutes.`);
      return;
    }

    const ADMIN_PASSWORD = "VEGA_SUPER_ADMIN_2025"; // CHANGE THIS

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_logged", "true");
      localStorage.removeItem("admin_attempts");
      localStorage.removeItem("admin_lock_until");
      navigate("/admin");
      return;
    }

    const newAttempts = storedAttempts + 1;
    localStorage.setItem("admin_attempts", newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockTime = Date.now() + LOCK_TIME;
      localStorage.setItem("admin_lock_until", lockTime.toString());
      setError("Too many incorrect attempts. Locked for 10 minutes.");
    } else {
      setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts left.`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fdf3f5]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-sm border border-pink-200"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8b1538]">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="password"
          className="w-full border p-3 rounded-lg mb-4 border-gray-300"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#8b1538] text-white p-3 rounded-lg font-semibold shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
