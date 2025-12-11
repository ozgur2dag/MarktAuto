from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Marketing Automation Service"
    database_url: str = "sqlite:///./marketing.db"
    api_prefix: str = "/api"
    secret_key: str = "change-me"  # replace in env for production

    class Config:
        env_file = ".env"


settings = Settings()

