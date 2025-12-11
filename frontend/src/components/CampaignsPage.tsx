import { useState } from "react";

type Segment = { id: number; name: string; criteria: string };
type Campaign = { id: number; name: string; channel: string; segment_id: number | null; status: string };

interface CampaignsPageProps {
  campaigns: Campaign[];
  segments: Segment[];
  submitCampaign: (name: string, channel: string, segmentId: string, schedule: string) => Promise<void>;
  launchCampaign: (id: number) => Promise<void>;
}

export function CampaignsPage({ campaigns, segments, submitCampaign, launchCampaign }: CampaignsPageProps) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("");
  const [segId, setSegId] = useState("");
  const [schedule, setSchedule] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCampaign(name, channel, segId, schedule);
    setName("");
    setChannel("");
    setSegId("");
    setSchedule("");
  };

  return (
    <div>
      <h2>Campaign Management</h2>
      
      {/* Creation Section */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Draft New Campaign</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
          <input placeholder="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Channel (Email, SMS)" value={channel} onChange={(e) => setChannel(e.target.value)} required />
          <select value={segId} onChange={(e) => setSegId(e.target.value)} required>
            <option value="">Select Segment</option>
            {segments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <label style={{ fontSize: "0.8rem", color: "#666" }}>Schedule (Optional)</label>
          <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
          <button type="submit" style={{ marginTop: "10px" }}>Save Draft</button>
        </form>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "2rem 0" }} />

      {/* Listing Section */}
      <h3>Ongoing Campaigns</h3>
      {campaigns.length === 0 ? (
        <p style={{ color: "#666" }}>No campaigns found.</p>
      ) : (
        <div className="list">
          {campaigns.map((c) => (
            <div key={c.id} className="item" style={{ background: "white", padding: "1rem", marginBottom: "0.5rem", borderRadius: "4px", border: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: "1.1rem" }}>{c.name}</strong>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  Channel: {c.channel} | Status: <span style={{ fontWeight: "bold", textTransform: "capitalize", color: c.status === 'sent' ? 'green' : 'orange' }}>{c.status}</span>
                </div>
              </div>
              
              {c.status === "draft" && (
                <button onClick={() => launchCampaign(c.id)} style={{ padding: "5px 10px" }}>
                  Launch Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}