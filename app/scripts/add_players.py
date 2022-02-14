from app import db
from app.Players import Players

F_PLAYERS = [
    ["Amaris", "He", 5],
    ["Joey", "Kuang", 5],
    ["Siya", "Lai", 2],
    ["Jodi", "Lee", 3],
    ["Jenny", "Lei", 3],
    ["Karla", "Mccallum", 1],
    ["Angela", "Chen", 4],
    ["Belle", "Tuen", 4],
    ["Nicole", "Wang", 1],
    ["Sherry", "Wu", 3],
]

M_PLAYERS = [
    ["Ivan", "Cheng", 3],
    ["Darren", "Choi", 2],
    ["Clement", "Chow", 3],
    ["Thomas", "Dent", 2],
    ["Tommy", "Du", 5],
    ["Tom", "Guo", 1],
    ["Aaron", "Hsu", 4],
    ["Jacob", "Kim", 1],
    ["Joseph", "Lu", 2],
    ["Harry", "Soo", 3],
    ["Kyle", "To", 3],
    ["Kevin", "Wang", 3],
    ["Mat", "Marr", 0],
    ["Andrew", "Zhuang", 0],
]

for p in F_PLAYERS:
    player = Players(
            first_name=p[0],
            last_name=p[1],
            elegible_year=p[2],
            sex='F',
        )
    db.session.add(player)

for p in M_PLAYERS:
    player = Players(
            first_name=p[0],
            last_name=p[1],
            elegible_year=p[2],
            sex='M',
        )
    db.session.add(player)

db.session.commit()
