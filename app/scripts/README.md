# 🏸 baddie-match

Scripts 

Run from base dir, run with python -m app.scripts."script"
Example 
```
python -m app.scripts.nuke
```

nuke.py will clear your local db. Can be run with arguments m for matches, p for players, and c for categories. Run with no args to clear entire db

add_prod_data will attempt to grab production data. Can be run with arguments m for matches, p for players, and c for categories. Run with no args to get all prod data
All player first names will ahve "_test" appended to the beggining of them, to not confuse your local env with prod. 

