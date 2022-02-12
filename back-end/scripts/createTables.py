import psycopg2
#from ..config import config

def createTables():
    conn = psycopg2.connect(
        host="localhost",
        database="test",
        user="postgres",
        password="password")

    commands = (
        """
        CREATE TABLE players (
            id INTEGER PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            players INTEGER[] NOT NULL,
            winners INTEGER[] NOT NULL,
            score INTEGER[] NOT NULL,
            category VARCHAR(255),
            date_added DATE,
            last_edit DATE
        )
        """,
        """
        CREATE TABLE matches (
            id INTEGER PRIMARY KEY,
            event VARCHAR(2) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            elegible_year INTEGER,
            sex VARCHAR(1) NOT NULL
        )
        """,
        )
    try:
        cur = conn.cursor()
        # create table one by one
        for command in commands:
            cur.execute(command)
        # close communication with the PostgreSQL database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    createTables()