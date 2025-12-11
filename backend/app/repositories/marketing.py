from typing import List, Optional

from sqlmodel import Session, select

from app.models.marketing import Campaign, CampaignEvent, Segment


class MarketingRepository:
    def __init__(self, session: Session):
        self.session = session

    # Segments
    def create_segment(self, name: str, criteria: str) -> Segment:
        segment = Segment(name=name, criteria=criteria)
        self.session.add(segment)
        self.session.commit()
        self.session.refresh(segment)
        return segment

    def list_segments(self) -> List[Segment]:
        return self.session.exec(select(Segment)).all()

    # Campaigns
    def create_campaign(
        self,
        name: str,
        channel: str,
        segment_id: Optional[int],
        schedule: Optional[str],
    ) -> Campaign:
        campaign = Campaign(
            name=name,
            channel=channel,
            segment_id=segment_id,
            schedule=schedule,
        )
        self.session.add(campaign)
        self.session.commit()
        self.session.refresh(campaign)
        return campaign

    def list_campaigns(self) -> List[Campaign]:
        return self.session.exec(select(Campaign)).all()

    def update_campaign_status(self, campaign_id: int, status: str) -> Campaign:
        campaign = self.session.get(Campaign, campaign_id)
        if campaign is None:
            raise ValueError("Campaign not found")
        campaign.status = status
        self.session.add(campaign)
        self.session.commit()
        self.session.refresh(campaign)
        return campaign

    # Events / analytics
    def record_event(
        self,
        campaign_id: int,
        event_type: str,
        occurred_at,
        event_metadata: Optional[str],
    ) -> CampaignEvent:
        event = CampaignEvent(
            campaign_id=campaign_id,
            event_type=event_type,
            occurred_at=occurred_at,
            event_metadata=event_metadata,
        )
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        return event

    def list_events(self, campaign_id: Optional[int] = None) -> List[CampaignEvent]:
        query = select(CampaignEvent)
        if campaign_id:
            query = query.where(CampaignEvent.campaign_id == campaign_id)
        return self.session.exec(query).all()

