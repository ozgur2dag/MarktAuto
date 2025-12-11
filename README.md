# Marketing Automation module template (FastAPI + React)

This template scaffolds the **MarketingAutomationModule**

- Presentation & API layer: FastAPI `PublicAPI` for marketing features (REST).
- Core Domain Modules: MarketingAutomationModule (segments, campaigns, analytics events).
- Shared services layer: placeholders for Auth/Identity, Notifications, Integrations, Logging.
- Presentation (optional): simple React/Vite client to exercise the API.

## Backend (FastAPI)

```bash
cd /backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # or choose a different port with --port 8001
```

Key endpoints (all under `/api/marketing`):
- `POST /segments` `{"name": "...", "criteria": "JSON/DSL"}` — create segment.
- `GET /segments` — list segments.
- `POST /campaigns` — create campaign tied to a segment.
- `GET /campaigns` — list campaigns.
- `POST /campaigns/{id}/launch` — mark a campaign as launched.
- `POST /campaigns/{id}/events` — record analytics events (sent/open/click/convert). Payload supports `event_type`, optional `occurred_at`, and optional `event_metadata`.
- `GET /events` — list events (optional `campaign_id` query).

Data is stored in `sqlite` (`marketing.db`). Adjust `database_url` in `app/core/config.py`.

## Frontend (React/Vite minimal scaffold)

```bash
cd /frontend
npm install          # installs @vitejs/plugin-react and friends
npm run dev          # Vite dev server (ESM, requires Node 18+)
```

The UI is intentionally minimal: create segments, create/launch campaigns, and post/view events against the FastAPI backend (defaults to `http://localhost:8000`; adjust if you run uvicorn on a different port or use `npm run dev -- --host --port 5173` to pick a port).

## Project layout

- `backend/app/core` — settings/config.
- `backend/app/api` — API routers (`PublicAPI`).
- `backend/app/models` — SQLModel entities for the MarketingAutomation module.
- `backend/app/services` — application logic (segmentation, campaigns, analytics).
- `backend/app/repositories` — data access.
- `backend/app/shared` — stubs for cross-cutting services (auth, notifications, integrations).
- `frontend` — React client to hit the marketing endpoints.



