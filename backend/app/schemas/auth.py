from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    email: EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserRead(SQLModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True
