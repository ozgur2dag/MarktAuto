import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { SegmentsPage } from "./components/SegmentsPage";
import { CampaignsPage } from "./components/CampaignsPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { NotificationBanner } from "./components/NotificationBanner";
import { API_BASE } from "./config";
// Assuming you have a logo file here
import logo from './assets/logo.png'; 

// --- Type Definitions ---
export type Segment = { id: number; name: string; criteria: string };
export type Campaign = {
  id: number;
  name: string;
  channel: string;
  segment_id: number | null;
  status: string;
};
export type Event = {
  id: number;
  campaign_id: number;
  event_type: string;
  occurred_at: string;
};

// --- Auth Hook ---
function useAuthToken() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const saveToken = (t: string | null) => {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
    setToken(t);
  };
  return { token, saveToken };
}

export default function App() {
  const { token, saveToken } = useAuthToken();
  const navigate = useNavigate();
  const location = useLocation();

  const [notice, setNotice] = useState<{ message: string; type: "success" | "error" | "info" }>({
    message: "",
    type: "info",
  });
  const showNotice = (message: string, type: "success" | "error" | "info") =>
    setNotice({ message, type });

  const authedFetch = (url: string, init?: RequestInit) =>
    fetch(url, {
      ...(init || {}),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  useEffect(() => {
    setNotice({ message: "", type: "info" });
  }, [location]);

  const [segments, setSegments] = useState<Segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const loadData = async () => {
    try {
      const [segmentsRes, campaignsRes, eventsRes] = await Promise.all([
        authedFetch(`${API_BASE}/marketing/segments`),
        authedFetch(`${API_BASE}/marketing/campaigns`),
        authedFetch(`${API_BASE}/marketing/events`),
      ]);
      setSegments(await segmentsRes.json());
      setCampaigns(await campaignsRes.json());
      setEvents(await eventsRes.json());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    if (token) {
      loadData().catch(console.error);
    }
  }, [token]);

  // --- API Actions (omitted for brevity) ---
  const submitSegment = async (name: string, criteria: string) => {
    await authedFetch(`${API_BASE}/marketing/segments`, {
      method: "POST",
      body: JSON.stringify({ name, criteria }),
    });
    await loadData();
    showNotice("Segment created", "success");
  };

  const submitCampaign = async (
    name: string,
    channel: string,
    segment_id: string,
    schedule: string
  ) => {
    await authedFetch(`${API_BASE}/marketing/campaigns`, {
      method: "POST",
      body: JSON.stringify({
        name,
        channel,
        segment_id: Number(segment_id),
        schedule: schedule || null,
      }),
    });
    await loadData();
    showNotice("Campaign created", "success");
  };

  const launchCampaign = async (id: number) => {
    await authedFetch(`${API_BASE}/marketing/campaigns/${id}/launch`, {
      method: "POST",
    });
    await loadData();
    showNotice("Campaign launched", "success");
  };

  const submitEvent = async (campaign_id: string, event_type: string) => {
    await authedFetch(`${API_BASE}/marketing/campaigns/${campaign_id}/events`, {
      method: "POST",
      body: JSON.stringify({ event_type }),
    });
    await loadData();
    showNotice("Event recorded", "success");
  };

  const authRequired = (node: JSX.Element) =>
    token ? node : <Navigate to="/login" replace />;

  const logout = () => {
    saveToken(null);
    navigate("/login");
  };

  // --- Final Nav Link Style ---
  const finalNavLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#333", // Dark grey text
    fontWeight: "500",
    fontSize: "1rem"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8F9FA" }}>
      
      {/* --- HEADER (Navbar) --- */}
      <header style={{ 
        display: "flex", 
        gap: "1rem", 
        alignItems: "center", 
        padding: "1rem 0", // Reduced vertical padding slightly, removed horizontal padding
        background: "#FFFFFF", // Clean White Navbar Background
        borderBottom: "1px solid #E0E0E0" // Subtle grey border
      }}>
        {/* Inner container for CENTERING and MAX-WIDTH */}
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", padding: "0 2rem" }}>
          
          {/* Logo and Title Section */}
          <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
             {/* Insert Logo */}
            <img 
                src={logo} 
                alt="MarktAuto Logo"
                style={{ height: '32px', width: 'auto' }} 
            />

            <h1 style={{ 
              marginBottom: 0, 
              fontSize: "1.5rem", 
              color: "#333", // Dark color for "Markt"
              fontFamily: "sans-serif",
              letterSpacing: "-0.5px"
            }}>
              Markt<span style={{ color: "#1565C0", fontWeight: "800" }}>Auto</span>
            </h1>
          </div>
          
          {token && (
            <nav style={{ display: "flex", gap: "1.5rem" }}>
              <Link to="/segments" style={finalNavLinkStyle}>Segments</Link>
              <Link to="/campaigns" style={finalNavLinkStyle}>Campaigns</Link>
              <Link to="/analytics" style={finalNavLinkStyle}>Analytics</Link>
            </nav>
          )}
          
          <div style={{ borderLeft: "1px solid #E0E0E0", paddingLeft: "1rem" }}>
            {!token ? (
              <>
                <Link to="/login" style={{ marginRight: "1rem", textDecoration: "none", color: "#1565C0", fontWeight: "bold" }}>Login</Link>
                <Link to="/register" style={{ textDecoration: "none", color: "#1565C0" }}>Register</Link>
              </>
            ) : (
              <button onClick={logout} style={{ 
                background: "transparent", 
                border: "1px solid #1565C0", 
                color: "#1565C0",
                padding: "6px 14px", 
                borderRadius: "4px", 
                cursor: "pointer",
                fontWeight: "bold"
              }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
  
      {/* --- Main Content Area (Centered) --- */}
      <div style={{ 
        flex: 1, 
        padding: "2rem", 
        width: "100%", 
        maxWidth: "1200px", 
        margin: "0 auto", 
        boxSizing: "border-box" 
      }}>
        <NotificationBanner
          message={notice.message}
          type={notice.type}
          onClose={() => setNotice({ message: "", type: "info" })}
        />
  
        <Routes>
          <Route path="/" element={authRequired(<Navigate to="/campaigns" replace />)} />
          
          <Route
            path="/segments"
            element={authRequired(
              <SegmentsPage 
                segments={segments} 
                submitSegment={submitSegment} 
              />
            )}
          />

          <Route
            path="/campaigns"
            element={authRequired(
              <CampaignsPage 
                campaigns={campaigns} 
                segments={segments}
                submitCampaign={submitCampaign}
                launchCampaign={launchCampaign}
              />
            )}
          />

          <Route
            path="/analytics"
            element={authRequired(
              <AnalyticsPage 
                events={events}
                campaigns={campaigns}
                submitEvent={submitEvent}
              />
            )}
          />
  
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <div className="auth-container">
                <LoginForm
                  onSuccess={(t) => { saveToken(t); showNotice("Logged in", "success"); navigate("/campaigns"); }}
                  onError={(msg) => showNotice(msg, "error")}
                />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="auth-container">
                <RegisterForm
                  onSuccess={(t) => { saveToken(t); showNotice("Registered", "success"); navigate("/campaigns"); }}
                  onError={(msg) => showNotice(msg, "error")}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}