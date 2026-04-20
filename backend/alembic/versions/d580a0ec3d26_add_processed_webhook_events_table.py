"""add processed_webhook_events table

Revision ID: d580a0ec3d26
Revises: c09e746a15bb
Create Date: 2026-04-20 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "d580a0ec3d26"
down_revision: Union[str, Sequence[str], None] = "c09e746a15bb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create processed_webhook_events table for Stripe webhook dedup."""
    op.create_table(
        "processed_webhook_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("event_id", sa.String(255), nullable=False),
        sa.Column("event_type", sa.String(255), nullable=False),
        sa.Column(
            "processed_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )
    op.create_index(
        "ix_processed_webhook_events_event_id",
        "processed_webhook_events",
        ["event_id"],
        unique=True,
    )


def downgrade() -> None:
    """Drop processed_webhook_events table."""
    op.drop_index(
        "ix_processed_webhook_events_event_id",
        table_name="processed_webhook_events",
    )
    op.drop_table("processed_webhook_events")
