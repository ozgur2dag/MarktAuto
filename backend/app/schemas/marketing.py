from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from sqlmodel import SQLModel  # <--- 1. Import SQLModel

# Create models can stay as BaseModel (input is JSON/dict)
class SegmentCreate(BaseModel):
    name: str
    criteria: str

# Read models must be SQLModel (to read from DB objects)
class SegmentRead(SQLModel):   # <--- 2. Changed from BaseModel
    id: int
    name: str
    criteria: str
    created_at: datetime

class CampaignCreate(BaseModel):
    name: str
    channel: str
    segment_id: Optional[int] = None
    schedule: Optional[str] = None

class CampaignRead(SQLModel):  # <--- 3. Changed from BaseModel
    id: int
    name: str
    channel: str
    segment_id: Optional[int]
    status: str
    schedule: Optional[str]
    created_at: datetime

class CampaignEventCreate(BaseModel):
    event_type: str
    occurred_at: Optional[datetime] = None
    event_metadata: Optional[str] = None

class CampaignEventRead(SQLModel): # <--- 4. Changed from BaseModel
    id: int
    campaign_id: int
    event_type: str
    occurred_at: datetime
    event_metadata: Optional[str]