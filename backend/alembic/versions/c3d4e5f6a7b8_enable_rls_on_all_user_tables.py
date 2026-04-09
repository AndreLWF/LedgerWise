"""enable RLS on all user tables

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-04-08 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Enable RLS on users, accounts, and transactions tables.

    plaid_items already has RLS from b2c3d4e5f6a7.
    transactions has no direct user_id — policy uses a subquery through accounts.
    """

    # ── users table ──────────────────────────────────────────────────
    op.execute('ALTER TABLE users ENABLE ROW LEVEL SECURITY')
    op.execute("""
        CREATE POLICY users_own_record ON users
            FOR ALL
            USING (id = auth.uid())
            WITH CHECK (id = auth.uid())
    """)

    # ── accounts table ───────────────────────────────────────────────
    op.execute('ALTER TABLE accounts ENABLE ROW LEVEL SECURITY')
    op.execute("""
        CREATE POLICY accounts_user_isolation ON accounts
            FOR ALL
            USING (user_id = auth.uid())
            WITH CHECK (user_id = auth.uid())
    """)

    # ── transactions table (user_id derived via accounts) ────────────
    op.execute('ALTER TABLE transactions ENABLE ROW LEVEL SECURITY')
    op.execute("""
        CREATE POLICY transactions_user_isolation ON transactions
            FOR ALL
            USING (
                account_id IN (
                    SELECT id FROM accounts WHERE user_id = auth.uid()
                )
            )
            WITH CHECK (
                account_id IN (
                    SELECT id FROM accounts WHERE user_id = auth.uid()
                )
            )
    """)


def downgrade() -> None:
    """Remove RLS policies from users, accounts, and transactions."""

    op.execute('DROP POLICY IF EXISTS transactions_user_isolation ON transactions')
    op.execute('ALTER TABLE transactions DISABLE ROW LEVEL SECURITY')

    op.execute('DROP POLICY IF EXISTS accounts_user_isolation ON accounts')
    op.execute('ALTER TABLE accounts DISABLE ROW LEVEL SECURITY')

    op.execute('DROP POLICY IF EXISTS users_own_record ON users')
    op.execute('ALTER TABLE users DISABLE ROW LEVEL SECURITY')
