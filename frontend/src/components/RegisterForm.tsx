import { useState } from "react";
import { API_BASE } from "../config";

export function RegisterForm({
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
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        
        let errorMessage = "Registration failed.";
        
        if (errorData.detail) {
          if (typeof errorData.detail === "string") {
            // Case 1: Custom HTTPException (400) returns a string
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Case 2: Pydantic Validation (422) returns an array
            // We grab the first error message from the list
            errorMessage = errorData.detail[0].msg;
          }
        }
        
        onError(errorMessage);
        return;
      }
      // auto-login after register
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password,
        }),
      });
      if (!loginRes.ok) {
        onError("Registered but login failed");
        return;
      }
      const data = await loginRes.json();
      onSuccess(data.access_token);
    } catch (err) {
      onError("Network error during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Inside RegisterForm.tsx return statement
  return (
    // ADD className="card" here
    <form 
      className="card"
      onSubmit={(e) => { e.preventDefault(); submit(); }}
    >
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      <div style={{ marginBottom: '1rem', color: '#666' }}>
        Enter your details below
      </div>
      
      <input
        placeholder="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? "Registering..." : "Register Now"}
      </button>
    </form>
  );
}

