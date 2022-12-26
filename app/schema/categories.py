from marshmallow import Schema, fields




#
class PlayerSchema(Schema):
    id = fields.Int()
    first_name = fields.Str()
    last_name = fields.Str()
    sex = fields.Str()
    elegible_year = fields.Int()


#
class CategorySchema(Schema):
    id = fields.Int()
    name = fields.Str()


# 
class MatchSchema(Schema):
    event = fields.Str()
    score  = fields.List(fields.Int())
    category = fields.Str()
    player1Id = fields.int()
    player2Id = fields.int()
    player3Id = fields.int()
    player4Id = fields.int()

class EloSchema(Schema):
    event = fields.Str()



