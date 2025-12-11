from sqlmodel import SQLModel, create_engine, Session

from app.core.config import settings
from app.models import marketing, user  # noqa: F401  ensures models are registered


engine = create_engine(settings.database_url, echo=False)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session

