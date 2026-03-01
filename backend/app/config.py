from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    teller_cert_path: str = "certs/teller.pem"
    teller_key_path: str = "certs/teller.key"
    teller_env: str = "sandbox"
    cors_origins: list[str] = ["http://localhost:8081"]


settings = Settings()
