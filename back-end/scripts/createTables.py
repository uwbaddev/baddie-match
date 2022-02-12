from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

def createTables():
    conn = psycopg2.connect(
        host=os.getenv("DATABASE_HOST"),
        database=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"))

    commands = (
        "DROP TABLE matches",
        "DROP TABLE players",
        "DROP TABLE categories",
        """
        CREATE TABLE matches (
            id SERIAL PRIMARY KEY,
            event VARCHAR(255),
            players INTEGER[],
            winners INTEGER[],
            score INTEGER[],
            category VARCHAR(255),
            date_added DATE,
            last_edit DATE
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