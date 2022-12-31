from marshmallow import Schema, fields, post_load
from app.src.players import Players
from app.src.categories import Categories
from app.src.matches import Matches


#
class PlayerSchema(Schema):
    first_name = fields.Str()
    last_name = fields.Str()
    sex = fields.Str()
    elegible_year = fields.Int()

    @post_load
    def create_player(self, data, **kwargs):
        return Players(**data)


#
class CategorySchema(Schema):
    name = fields.Str()

    @post_load 
    def create_category(self, data, **kwargs):
        return Categories(**data)

# 
class MatchSchema(Schema):
    event = fields.Str()
    score  = fields.List(fields.Int())
    category = fields.Str()
    player1Id = fields.Int()
    player2Id = fields.Int()
    player3Id = fields.Int()
    player4Id = fields.Int()

    @post_load 
    def create_Match(self, data, **kwargs):
        return Matches(**data)

#
class EloSchema(Schema):
    event = fields.Str()



