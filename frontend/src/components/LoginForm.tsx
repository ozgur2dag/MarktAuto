import { useState } from "react";
import { API_BASE } from "../config";

export function LoginForm({
  onSuccess,
  onError,
}: {
  onSuccess: (token: string) => void;
  onError: (msg: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    onError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password,
        }),
      });
      if (!res.ok) {
        onError("Login failed. Check credentials.");
        return;
      }
      const data = await res.json();
      onSuccess(data.access_token);
    } catch (err) {
      onError("Network error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

