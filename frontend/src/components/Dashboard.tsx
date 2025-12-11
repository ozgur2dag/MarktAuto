import { useState } from "react";

type Segment = { id: number; name: string; criteria: string };
type Campaign = {
  id: number;
  name: string;
  channel: string;
  segment_id: number | null;
  status: string;
};
type Event = {
  id: number;
  campaign_id: number;
  event_type: string;
  occurred_at: string;
};

export function Dashboard({
  segments,
  campaigns,
  events,
  submitSegment,
  submitCampaign,
  launchCampaign,
  submitEvent,
}: {
  segments: Segment[];
  campaigns: Campaign[];
  events: Event[];
  submitSegment: (name: string, criteria: string) => Promise<void>;
  submitCampaign: (
    name: string,
    channel: string,
    segment_id: string,
    schedule: string
  ) => Promise<void>;
  launchCampaign: (id: number) => Promise<void>;
  submitEvent: (campaign_id: string, event_type: string) => Promise<void>;
}) {
  const [segmentForm, setSegmentForm] = useState({ name: "", criteria: "" });
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    channel: "email",
    segment_id: "",
    schedule: "",
  });
  const [eventForm, setEventForm] = useState({
    campaign_id: "",
    event_type: "sent",
  });

  return (
    <>
      <section>
        <h2>Segments</h2>
        <input
          placeholder="Segment name"
          value={segmentForm.name}
          onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })}
        />
        <input
          placeholder='Criteria (e.g. {"country": "US"})'
          value={segmentForm.criteria}
          onChange={(e) =>
            setSegmentForm({ ...segmentForm, criteria: e.target.value })
          }
        />
        <button
          onClick={() =>
            submitSegment(segmentForm.name, segmentForm.criteria).then(() =>
              setSegmentForm({ name: "", criteria: "" })
            )
          }
        >
          Create segment
        </button>
        <ul>
          {segments.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong> — {s.criteria}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Campaigns</h2>
        <input
          placeholder="Campaign name"
          value={campaignForm.name}
          onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
        />
        <select
          value={campaignForm.channel}
          onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}
        >
          <option value="email">Email</option>
          <option value="social">Social</option>
          <option value="ads">Ads</option>
        </select>
        <select
          value={campaignForm.segment_id}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, segment_id: e.target.value })
          }
        >
          <option value="">Select segment</option>
          {segments.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Schedule (optional)"
          value={campaignForm.schedule}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, schedule: e.target.value })
          }
        />
        <button
          onClick={() =>
            submitCampaign(
              campaignForm.name,
              campaignForm.channel,
              campaignForm.segment_id,
              campaignForm.schedule
            ).then(() =>
              setCampaignForm({
                name: "",
                channel: "email",
                segment_id: "",
                schedule: "",
              })
            )
          }
        >
          Create campaign
        </button>
        <ul>
          {campaigns.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.channel} — status: {c.status}
              <button onClick={() => launchCampaign(c.id)}>Launch</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Events / Analytics</h2>
        <select
          value={eventForm.campaign_id}
          onChange={(e) =>
            setEventForm({ ...eventForm, campaign_id: e.target.value })
          }
        >
          <option value="">Select campaign</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={eventForm.event_type}
          onChange={(e) =>
            setEventForm({ ...eventForm, event_type: e.target.value })
          }
        >
          <option value="sent">sent</option>
          <option value="opened">opened</option>
          <option value="clicked">clicked</option>
          <option value="converted">converted</option>
        </select>
        <button
          onClick={() =>
            submitEvent(eventForm.campaign_id, eventForm.event_type).then(() =>
              setEventForm({ campaign_id: "", event_type: "sent" })
            )
          }
        >
          Record event
        </button>
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              Campaign {e.campaign_id}: {e.event_type} at{" "}
              {new Date(e.occurred_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

