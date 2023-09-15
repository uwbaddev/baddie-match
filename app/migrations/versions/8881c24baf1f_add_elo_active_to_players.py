"""add elo, active to players

Revision ID: 8881c24baf1f
Revises: d4147579035a
Create Date: 2023-09-10 19:02:27.415347

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '8881c24baf1f'
down_revision = 'd4147579035a'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("players") as batch_op:
        batch_op.add_column(sa.Column("elo", sa.Float, server_default='25.0'))
        batch_op.add_column(sa.Column("active", sa.Boolean, server_default='True'))
    pass


def downgrade():
    with op.batch_alter_table("players") as batch_op:
        batch_op.drop_column("elo")
        batch_op.drop_column("active")
    pass
