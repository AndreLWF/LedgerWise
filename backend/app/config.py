import base64
import os
import stat

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    teller_cert_path: str = "certs/certificate.pem"
    teller_key_path: str = "certs/private_key.pem"
    teller_env: str = "sandbox"
    cors_origins: list[str] = ["http://localhost:8081"]

    # Base64-encoded cert/key for production (Railway)
    teller_cert_b64: str = ""
    teller_key_b64: str = ""

    # Supabase
    database_url: str = ""
    supabase_url: str = ""
    supabase_key: str = ""

    # Plaid
    plaid_client_id: str = ""
    plaid_secret: str = ""
    plaid_env: str = "sandbox"
    plaid_redirect_uri: str = ""

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_id_monthly: str = ""
    stripe_price_id_yearly: str = ""

    # Encryption — 256-bit hex key for AES-GCM (generate with: python -c "import os; print(os.urandom(32).hex())")
    encryption_key: str = ""

    def write_teller_certs(self) -> None:
        """Decode base64 env vars to cert files if they don't already exist on disk."""
        if self.teller_cert_b64 and not os.path.exists(self.teller_cert_path):
            os.makedirs(os.path.dirname(self.teller_cert_path), exist_ok=True)
            with open(self.teller_cert_path, "wb") as f:
                f.write(base64.b64decode(self.teller_cert_b64))
            os.chmod(self.teller_cert_path, stat.S_IRUSR | stat.S_IWUSR)
        if self.teller_key_b64 and not os.path.exists(self.teller_key_path):
            os.makedirs(os.path.dirname(self.teller_key_path), exist_ok=True)
            with open(self.teller_key_path, "wb") as f:
                f.write(base64.b64decode(self.teller_key_b64))
            os.chmod(self.teller_key_path, stat.S_IRUSR | stat.S_IWUSR)


settings = Settings()
settings.write_teller_certs()


def _validate_startup() -> None:
    """Fail fast if critical secrets are missing or malformed."""
    missing = []
    if not settings.database_url:
        missing.append("DATABASE_URL")
    if not settings.supabase_url:
        missing.append("SUPABASE_URL")
    if not settings.supabase_key:
        missing.append("SUPABASE_KEY")
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

    # Stripe billing — all four are required when any one is set
    stripe_vars = {
        "STRIPE_SECRET_KEY": settings.stripe_secret_key,
        "STRIPE_WEBHOOK_SECRET": settings.stripe_webhook_secret,
        "STRIPE_PRICE_ID_MONTHLY": settings.stripe_price_id_monthly,
        "STRIPE_PRICE_ID_YEARLY": settings.stripe_price_id_yearly,
    }
    stripe_set = {k for k, v in stripe_vars.items() if v}
    if stripe_set and stripe_set != set(stripe_vars.keys()):
        missing_stripe = set(stripe_vars.keys()) - stripe_set
        raise RuntimeError(
            f"Partial Stripe config — missing: {', '.join(sorted(missing_stripe))}"
        )

    key = settings.encryption_key
    if not key:
        raise RuntimeError("ENCRYPTION_KEY env var is not set")
    try:
        key_bytes = bytes.fromhex(key)
    except ValueError:
        raise RuntimeError("ENCRYPTION_KEY must be valid hex characters")
    if len(key_bytes) != 32:
        raise RuntimeError("ENCRYPTION_KEY must be exactly 64 hex chars (256 bits)")


_validate_startup()
