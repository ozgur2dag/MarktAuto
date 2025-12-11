from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Segment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    criteria: str  # JSON or DSL describing filters
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Campaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    channel: str  # email, social, ads, etc.
    segment_id: Optional[int] = Field(default=None, foreign_key="segment.id")
    status: str = "draft"
    schedule: Optional[str] = None  # cron or ISO date string
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CampaignEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="campaign.id")
    event_type: str  # sent, opened, clicked, converted
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    event_metadata: Optional[str] = None  # free-form JSON string

