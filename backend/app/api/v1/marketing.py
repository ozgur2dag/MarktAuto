from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.deps import get_db
from app.api.v1.auth import oauth2_scheme
from app.repositories.marketing import MarketingRepository
from app.schemas.marketing import (
    CampaignCreate,
    CampaignEventCreate,
    CampaignEventRead,
    CampaignRead,
    SegmentCreate,
    SegmentRead,
)
from app.services.marketing import MarketingService

router = APIRouter(prefix="/marketing", tags=["marketing"])


def get_service(session: Session = Depends(get_db)) -> MarketingService:
    repo = MarketingRepository(session)
    return MarketingService(repo)


@router.post("/segments", response_model=SegmentRead)
def create_segment(
    payload: SegmentCreate,
    service: MarketingService = Depends(get_service),
    token: str = Depends(oauth2_scheme),
):
    return service.create_segment(payload)


@router.get("/segments", response_model=list[SegmentRead])
def list_segments(
    service: MarketingService = Depends(get_service), token: str = Depends(oauth2_scheme)
):
    return service.list_segments()


@router.post("/campaigns", response_model=CampaignRead)
def create_campaign(
    payload: CampaignCreate,
    service: MarketingService = Depends(get_service),
    token: str = Depends(oauth2_scheme),
):
    if payload.segment_id is None:
        raise HTTPException(status_code=400, detail="segment_id is required")
    return service.create_campaign(payload)


@router.get("/campaigns", response_model=list[CampaignRead])
def list_campaigns(
    service: MarketingService = Depends(get_service), token: str = Depends(oauth2_scheme)
):
    return service.list_campaigns()


@router.post("/campaigns/{campaign_id}/launch", response_model=CampaignRead)
def launch_campaign(
    campaign_id: int,
    service: MarketingService = Depends(get_service),
    token: str = Depends(oauth2_scheme),
):
    try:
        return service.launch_campaign(campaign_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post(
    "/campaigns/{campaign_id}/events",
    response_model=CampaignEventRead,
)
def record_event(
    campaign_id: int,
    payload: CampaignEventCreate,
    service: MarketingService = Depends(get_service),
    token: str = Depends(oauth2_scheme),
):
    return service.record_event(campaign_id, payload)


@router.get("/events", response_model=list[CampaignEventRead])
def list_events(
    campaign_id: int | None = None,
    service: MarketingService = Depends(get_service),
    token: str = Depends(oauth2_scheme),
):
    return service.list_events(campaign_id)

