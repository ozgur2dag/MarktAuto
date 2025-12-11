import { useState } from "react";

// Types
type Segment = { id: number; name: string; criteria: string };

interface SegmentsPageProps {
  segments: Segment[];
  submitSegment: (name: string, criteria: string) => Promise<void>;
}

export function SegmentsPage({ segments, submitSegment }: SegmentsPageProps) {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSegment(name, criteria);
    setName("");
    setCriteria("");
  };

  return (
    <div>
      <h2>Audience Management</h2>
      
      {/* Creation Section */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Create New Segment</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input 
              placeholder="Segment Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ flex: 1 }}
            />
            <input 
              placeholder="Criteria (e.g., age > 25)" 
              value={criteria} 
              onChange={(e) => setCriteria(e.target.value)} 
              required 
              style={{ flex: 2 }}
            />
          </div>
          <button type="submit">Create Segment</button>
        </form>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "2rem 0" }} />

      {/* Listing Section */}
      <h3>Existing Segments</h3>
      {segments.length === 0 ? (
        <p style={{ color: "#666" }}>No segments found. Create one above.</p>
      ) : (
        <div className="list">
          {segments.map((seg) => (
            <div key={seg.id} className="item" style={{ background: "white", padding: "1rem", marginBottom: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
              <strong>{seg.name}</strong>
              <div style={{ color: "#555", fontSize: "0.9rem", marginTop: "4px" }}>
                Criteria: {seg.criteria}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}