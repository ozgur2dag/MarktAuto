from datetime import datetime
from typing import List, Optional

from app.repositories.marketing import MarketingRepository
from app.schemas.marketing import (
    CampaignCreate,
    CampaignEventCreate,
    CampaignEventRead,
    CampaignRead,
    SegmentCreate,
    SegmentRead,
)


class MarketingService:
    def __init__(self, repo: MarketingRepository):
        self.repo = repo

    # Segments
    def create_segment(self, payload: SegmentCreate) -> SegmentRead:
        segment = self.repo.create_segment(payload.name, payload.criteria)
        return SegmentRead.model_validate(segment)

    def list_segments(self) -> List[SegmentRead]:
        return [SegmentRead.model_validate(seg) for seg in self.repo.list_segments()]

    # Campaigns
    def create_campaign(self, payload: CampaignCreate) -> CampaignRead:
        campaign = self.repo.create_campaign(
            name=payload.name,
            channel=payload.channel,
            segment_id=payload.segment_id,
            schedule=payload.schedule,
        )
        return CampaignRead.model_validate(campaign)

    def list_campaigns(self) -> List[CampaignRead]:
        return [CampaignRead.model_validate(c) for c in self.repo.list_campaigns()]

    def launch_campaign(self, campaign_id: int) -> CampaignRead:
        campaign = self.repo.update_campaign_status(campaign_id, status="launched")
        return CampaignRead.model_validate(campaign)

    # Analytics
    def record_event(
        self, campaign_id: int, payload: CampaignEventCreate
    ) -> CampaignEventRead:
        occurred_at = payload.occurred_at or datetime.utcnow()
        event = self.repo.record_event(
            campaign_id=campaign_id,
            event_type=payload.event_type,
            occurred_at=occurred_at,
            event_metadata=payload.event_metadata,
        )
        return CampaignEventRead.model_validate(event)

    def list_events(self, campaign_id: Optional[int] = None) -> List[CampaignEventRead]:
        return [
            CampaignEventRead.model_validate(evt)
            for evt in self.repo.list_events(campaign_id=campaign_id)
        ]

