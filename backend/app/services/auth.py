from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select

from app.core.config import settings
from app.models.user import User
from app.schemas.auth import TokenData, UserCreate, UserRead


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(*, user_id: int, email: str, expires_minutes: int = 60) -> str:
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


class AuthService:
    def __init__(self, session: Session):
        self.session = session

    def register(self, payload: UserCreate) -> UserRead:
        # ensure unique email
        existing = self.session.exec(select(User).where(User.email == payload.email)).first()
        if existing:
            raise ValueError("Email already registered")
        user = User(email=payload.email, hashed_password=get_password_hash(payload.password))
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return UserRead.model_validate(user)

    def authenticate(self, email: str, password: str) -> Optional[User]:
        user = self.session.exec(select(User).where(User.email == email)).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def issue_token(self, user: User) -> str:
        return create_access_token(user_id=user.id, email=user.email)

    def decode_token(self, token: str) -> TokenData:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
            email = payload.get("email")
            return TokenData(user_id=user_id, email=email)
        except JWTError as exc:
            raise ValueError("Invalid token") from exc

