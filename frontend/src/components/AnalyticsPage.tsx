import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// --- Types ---
type Campaign = { id: number; name: string };
type Event = { id: number; campaign_id: number; event_type: string; occurred_at: string };

interface AnalyticsPageProps {
  events: Event[];
  campaigns: Campaign[];
  submitEvent: (campaignId: string, eventType: string) => Promise<void>;
}

export function AnalyticsPage({ events, campaigns, submitEvent }: AnalyticsPageProps) {
  const [campId, setCampId] = useState("");

  // --- 1. Data Processing Logic ---
  const campaignStats = useMemo(() => {
    return campaigns.map((campaign) => {
      const campEvents = events.filter((e) => e.campaign_id === campaign.id);
      
      const views = campEvents.filter((e) => e.event_type === "view").length;
      const clicks = campEvents.filter((e) => e.event_type === "click").length;
      const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0";
      const revenue = clicks * 10; 

      // Create a truncated name for the charts to prevent overlapping
      const shortName = campaign.name.length > 12 
        ? campaign.name.substring(0, 10) + "..." 
        : campaign.name;

      return {
        name: campaign.name,
        shortName, // Use this for Axis labels
        views,
        clicks,
        ctr: Number(ctr),
        revenue,
      };
    });
  }, [events, campaigns]);

  const totalRevenue = campaignStats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalClicks = campaignStats.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalViews = campaignStats.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Marketing Performance Dashboard</h2>
        
        {/* Simulation Tool */}
        <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "8px", border: "1px solid #eee", fontSize: "0.85rem" }}>
          <strong>Simulate Data: </strong>
          <select value={campId} onChange={(e) => setCampId(e.target.value)} style={{ marginRight: "5px" }}>
            <option value="">Select Campaign</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => submitEvent(campId, "view")} disabled={!campId}>+ View</button>
          <button onClick={() => submitEvent(campId, "click")} disabled={!campId}>+ Click</button>
        </div>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "1.5rem 0" }} />

      {/* --- 2. KPI Cards --- */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <KpiCard title="Total Revenue (Attr.)" value={`$${totalRevenue}`} color="#2e7d32" />
        <KpiCard title="Total Clicks (Leads)" value={totalClicks} color="#1565c0" />
        <KpiCard title="Total Views (Reach)" value={totalViews} color="#6a1b9a" />
        <KpiCard 
          title="Avg Conversion Rate" 
          value={totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : "0%"} 
          color="#ef6c00" 
        />
      </div>

      {/* --- 3. Visualizations --- */}
      {/* Increased gap and ensured grid responsiveness */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
        
        {/* Chart A: Campaign Effectiveness */}
        <div className="card">
          <h3>Campaign Effectiveness</h3>
          <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "1rem" }}>Comparing Reach (Views) vs Engagement (Clicks)</p>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={campaignStats} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                {/* Use shortName to prevent text collision */}
                <XAxis dataKey="shortName" interval={0} fontSize={12} />
                <YAxis />
                {/* Custom Tooltip to show full name */}
                <Tooltip labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) return payload[0].payload.name;
                  return label;
                }} />
                <Legend />
                <Bar dataKey="views" fill="#e0e0e0" name="Views" />
                <Bar dataKey="clicks" fill="#1565c0" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: ROI / Revenue */}
        <div className="card">
          <h3>Attributed Revenue</h3>
          <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "1rem" }}>Est. Revenue generated per campaign ($10/click)</p>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              {/* Added margins to left to fit labels */}
              <BarChart data={campaignStats} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                {/* Increased width to fit labels, used shortName */}
                <YAxis dataKey="shortName" type="category" width={100} fontSize={12} />
                <Tooltip formatter={(value) => `$${value}`} labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) return payload[0].payload.name;
                  return label;
                }} />
                <Legend />
                <Bar dataKey="revenue" fill="#2e7d32" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- 4. Detailed Data Table --- */}
      <h3>Campaign Performance Breakdown</h3>
      {/* Added overflow-x: auto to allow table to scroll instead of squishing */}
      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table width="100%" style={{ borderCollapse: "collapse", minWidth: "600px" }}>
          <thead style={{ background: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left", whiteSpace: "nowrap" }}>Campaign Name</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Views</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Clicks</th>
              <th style={{ padding: "12px", textAlign: "right" }}>CTR (%)</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Revenue</th>
            </tr>
          </thead>
            <tbody>
            {campaignStats.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "1rem", textAlign: "center" }}>No data available</td></tr>
            ) : (
                campaignStats.map((stat) => (
                <tr key={stat.name} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", fontWeight: "500" }}>{stat.name}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{stat.views}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{stat.clicks}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                    <span style={{ 
                        fontWeight: "bold", 
                        color: stat.ctr > 20 ? "green" : stat.ctr > 5 ? "orange" : "red" 
                    }}>
                        {stat.ctr}%
                    </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${stat.revenue}</td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: "150px", borderLeft: `5px solid ${color}`, padding: "1rem" }}>
      <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>{value}</div>
    </div>
  );
}