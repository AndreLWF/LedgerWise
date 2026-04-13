"""add stripe billing columns to users

Revision ID: d5e6f7a8b9c0
Revises: be2432f12464
Create Date: 2026-04-12 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d5e6f7a8b9c0"
down_revision: str = "be2432f12464"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_pro", sa.Boolean(), server_default="false", nullable=False),
    )
    op.add_column(
        "users",
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "stripe_customer_id")
    op.drop_column("users", "is_pro")
