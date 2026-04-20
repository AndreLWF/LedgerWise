"""add indexes on transaction category and merchant_name_lower

Revision ID: 4137a9c45c5a
Revises: d580a0ec3d26
Create Date: 2026-04-20 15:20:46.162204

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '4137a9c45c5a'
down_revision: Union[str, Sequence[str], None] = 'd580a0ec3d26'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index('ix_transactions_category', 'transactions', ['category'], unique=False)
    op.create_index('ix_transactions_merchant_name_lower', 'transactions', [sa.text('lower(merchant_name)')], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_transactions_merchant_name_lower', table_name='transactions')
    op.drop_index('ix_transactions_category', table_name='transactions')
