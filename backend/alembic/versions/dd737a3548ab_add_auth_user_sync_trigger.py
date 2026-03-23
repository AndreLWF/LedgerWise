"""add_auth_user_sync_trigger

Revision ID: dd737a3548ab
Revises: d9c925754451
Create Date: 2026-03-22 20:17:48.025753

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd737a3548ab'
down_revision: Union[str, Sequence[str], None] = 'd9c925754451'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create a trigger that copies new auth.users rows into public.users."""
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.users (id, email, name, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.email,
                COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO NOTHING;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)

    op.execute("""
        CREATE OR REPLACE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_auth_user();
    """)


def downgrade() -> None:
    """Remove the auth user sync trigger and function."""
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;")
    op.execute("DROP FUNCTION IF EXISTS public.handle_new_auth_user();")

