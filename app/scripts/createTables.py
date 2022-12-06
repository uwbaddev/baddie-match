from dotenv import load_dotenv
import os
import psycopg2
import sys

# run in the venv
# running with commandline with any single arg will drop all old tables before creating. 

load_dotenv()

def createTables():
    conn = psycopg2.connect(
        host=os.getenv("DATABASE_HOST"),
        database=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        port = os.getenv("DATABASE_PORT"))

    drop = (
        "DROP TABLE matches",
        "DROP TABLE players",
        "DROP TABLE categories",
        )

    commands = (
        """
        CREATE TABLE matches (
            id SERIAL PRIMARY KEY,
            event VARCHAR(255),
            players INTEGER[],
            winners INTEGER[],
            score INTEGER[],
            category VARCHAR(255),
            date_added TIMESTAMP,
            last_edit TIMESTAMP
        )
        """,
        """
        CREATE TABLE players (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            elegible_year INTEGER,
            sex VARCHAR(1) NOT NULL
        )
        """,
        """
        CREATE TABLE categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
        """,
        )
    try:
        cur = conn.cursor()

        # drop tables, if provided args
        if (len(sys.argv) == 2):
            print('dropping old tables')
            for d in drop:
                cur.execute(d)
        conn.commit()


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