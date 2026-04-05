"""add indexes on frequently filtered columns

Revision ID: a1b2c3d4e5f6
Revises: 9732c2274d0c
Create Date: 2026-04-04 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '9732c2274d0c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add indexes on columns used in WHERE/JOIN filters for faster queries."""
    op.create_index('ix_accounts_user_id', 'accounts', ['user_id'], if_not_exists=True)
    op.create_index('ix_transactions_account_id', 'transactions', ['account_id'], if_not_exists=True)
    op.create_index('ix_transactions_date', 'transactions', ['date'], if_not_exists=True)


def downgrade() -> None:
    """Remove performance indexes."""
    op.drop_index('ix_transactions_date', table_name='transactions')
    op.drop_index('ix_transactions_account_id', table_name='transactions')
    op.drop_index('ix_accounts_user_id', table_name='accounts')
