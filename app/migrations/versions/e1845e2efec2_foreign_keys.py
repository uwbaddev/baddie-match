"""foreign keys

Revision ID: e1845e2efec2
Revises: 8881c24baf1f
Create Date: 2024-06-22 20:36:17.553195

"""
from alembic import op
import sqlalchemy as sa 
from sqlalchemy import Column, INTEGER, ForeignKey


# revision identifiers, used by Alembic.
revision = 'e1845e2efec2'
down_revision = '8881c24baf1f'
branch_labels = None
depends_on = None


def upgrade():
    # add foreign key for category to matches instead of string
    op.execute("ALTER TABLE matches ALTER COLUMN category TYPE integer USING category::integer")
    op.create_foreign_key('fk_match_category','matches','categories',["category"],['id'])

    # add foreign key for matches players array instead of array of integers
    #make a association table where primary keys of both matches and players and foreign keys of the association table <- dont do this
    #create four new columns, make them all foreign keys of players <- do this one
    op.add_column('matches', Column('player_1', INTEGER, ForeignKey("players.id")))
    op.add_column('matches', Column('player_2', INTEGER, ForeignKey("players.id")))
    op.add_column('matches', Column('player_3', INTEGER, ForeignKey("players.id")))
    op.add_column('matches', Column('player_4', INTEGER, ForeignKey("players.id")))


    # make another migration after this to properly populate the columns
    pass


def downgrade():
    # remove foreign key for string instead
    op.drop_constraint('fk_match_category', 'matches', type_='foreignkey')
    op.execute("ALTER TABLE matches ALTER COLUMN category TYPE varchar")

    #drop foreign key colums for matches
    op.drop_column('matches', Column('player_1', INTEGER, ForeignKey("players.id")))
    op.drop_column('matches', Column('player_2', INTEGER, ForeignKey("players.id")))
    op.drop_column('matches', Column('player_3', INTEGER, ForeignKey("players.id")))
    op.drop_column('matches', Column('player_4', INTEGER, ForeignKey("players.id")))

    pass
