"""add plaid support schema

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-04-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add Plaid support: new plaid_items table, new columns on accounts & transactions.

    Amount sign convention (documented, no data change needed):
    - Teller: positive = debit (money out), negative = credit (money in)
    - Plaid /transactions/sync: positive = debit (money out), negative = credit (money in)
    - Both use the same convention — no sign normalization required.

    All new columns are nullable or have defaults so existing Teller data is preserved.
    """

    # ── plaid_items table ──────────────────────────────────────────────
    op.create_table(
        'plaid_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('item_id', sa.String(255), unique=True, nullable=False),
        sa.Column('access_token', sa.String(512), nullable=False),
        sa.Column('institution_id', sa.String(255), nullable=True),
        sa.Column('institution_name', sa.String(255), nullable=True),
        sa.Column('sync_cursor', sa.Text(), nullable=True),
        sa.Column('last_synced_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_plaid_items_user_id', 'plaid_items', ['user_id'])

    # ── accounts table — new columns ──────────────────────────────────
    op.add_column('accounts', sa.Column(
        'provider', sa.String(20), nullable=False, server_default='teller',
    ))
    op.add_column('accounts', sa.Column('item_id', sa.String(255), nullable=True))
    op.add_column('accounts', sa.Column('persistent_account_id', sa.String(255), nullable=True))
    op.add_column('accounts', sa.Column('balance_current', sa.Numeric(12, 2), nullable=True))
    op.add_column('accounts', sa.Column('balance_limit', sa.Numeric(12, 2), nullable=True))

    # CHECK constraint: provider must be 'teller' or 'plaid'
    op.create_check_constraint('ck_accounts_provider', 'accounts', "provider IN ('teller', 'plaid')")

    # Index on item_id for Plaid item lookups
    op.create_index('ix_accounts_item_id', 'accounts', ['item_id'])

    # Unique constraint for Plaid account upserts
    op.create_unique_constraint('uq_plaid_account_per_item', 'accounts', ['item_id', 'persistent_account_id'])

    # Make Teller-specific columns nullable (they were NOT NULL before)
    op.alter_column('accounts', 'teller_account_id', nullable=True)
    op.alter_column('accounts', 'teller_access_token', nullable=True)

    # ── transactions table — new columns ──────────────────────────────
    op.add_column('transactions', sa.Column(
        'provider', sa.String(20), nullable=False, server_default='teller',
    ))
    op.add_column('transactions', sa.Column('plaid_transaction_id', sa.String(255), nullable=True))
    op.add_column('transactions', sa.Column('personal_finance_category_primary', sa.String(100), nullable=True))
    op.add_column('transactions', sa.Column('personal_finance_category_detailed', sa.String(100), nullable=True))
    op.add_column('transactions', sa.Column('payment_channel', sa.String(20), nullable=True))
    op.add_column('transactions', sa.Column('pending', sa.Boolean(), server_default='false', nullable=False))
    op.add_column('transactions', sa.Column('authorized_date', sa.Date(), nullable=True))

    # CHECK constraint: provider must be 'teller' or 'plaid'
    op.create_check_constraint('ck_transactions_provider', 'transactions', "provider IN ('teller', 'plaid')")

    # Unique constraint for Plaid transaction upserts
    op.create_unique_constraint('uq_plaid_transaction_per_account', 'transactions', ['plaid_transaction_id', 'account_id'])

    # Make Teller-specific column nullable
    op.alter_column('transactions', 'teller_transaction_id', nullable=True)

    # ── RLS on plaid_items ────────────────────────────────────────────
    op.execute('ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY')
    op.execute("""
        CREATE POLICY plaid_items_user_isolation ON plaid_items
            FOR ALL
            USING (user_id = auth.uid())
            WITH CHECK (user_id = auth.uid())
    """)


def downgrade() -> None:
    """Reverse Plaid schema additions. Existing Teller data is untouched."""

    # ── Drop RLS policy ───────────────────────────────────────────────
    op.execute('DROP POLICY IF EXISTS plaid_items_user_isolation ON plaid_items')
    op.execute('ALTER TABLE plaid_items DISABLE ROW LEVEL SECURITY')

    # ── transactions — revert ─────────────────────────────────────────
    op.drop_constraint('uq_plaid_transaction_per_account', 'transactions', type_='unique')
    op.alter_column('transactions', 'teller_transaction_id', nullable=False)
    op.drop_constraint('ck_transactions_provider', 'transactions', type_='check')
    op.drop_column('transactions', 'authorized_date')
    op.drop_column('transactions', 'pending')
    op.drop_column('transactions', 'payment_channel')
    op.drop_column('transactions', 'personal_finance_category_detailed')
    op.drop_column('transactions', 'personal_finance_category_primary')
    op.drop_column('transactions', 'plaid_transaction_id')
    op.drop_column('transactions', 'provider')

    # ── accounts — revert ─────────────────────────────────────────────
    op.drop_constraint('uq_plaid_account_per_item', 'accounts', type_='unique')
    op.alter_column('accounts', 'teller_access_token', nullable=False)
    op.alter_column('accounts', 'teller_account_id', nullable=False)
    op.drop_index('ix_accounts_item_id', table_name='accounts')
    op.drop_constraint('ck_accounts_provider', 'accounts', type_='check')
    op.drop_column('accounts', 'balance_limit')
    op.drop_column('accounts', 'balance_current')
    op.drop_column('accounts', 'persistent_account_id')
    op.drop_column('accounts', 'item_id')
    op.drop_column('accounts', 'provider')

    # ── plaid_items — drop table ──────────────────────────────────────
    op.drop_index('ix_plaid_items_user_id', table_name='plaid_items')
    op.drop_table('plaid_items')
