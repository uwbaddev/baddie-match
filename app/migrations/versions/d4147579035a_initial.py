"""initial

Revision ID: d4147579035a
Revises: 
Create Date: 2023-09-10 18:32:32.875215

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd4147579035a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('players',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('first_name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('last_name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('elegible_year', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('sex', sa.VARCHAR(length=1), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='players_pkey')
    )
    op.create_table('categories',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='categories_pkey')
    )
    op.create_table('matches',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('event', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('players', postgresql.ARRAY(sa.INTEGER()), autoincrement=False, nullable=True),
    sa.Column('winners', postgresql.ARRAY(sa.INTEGER()), autoincrement=False, nullable=True),
    sa.Column('score', postgresql.ARRAY(sa.INTEGER()), autoincrement=False, nullable=True),
    sa.Column('category', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('date_added', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('last_edit', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='matches_pkey')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('matches')
    op.drop_table('categories')
    op.drop_table('players')
    # ### end Alembic commands ###