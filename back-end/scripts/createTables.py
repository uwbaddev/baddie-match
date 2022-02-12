from dotenv import load_dotenv
import os
import psycopg2
#from ..config import config

load_dotenv()

def createTables():
    conn = psycopg2.connect(
        host=os.getenv("DATABASE_HOST"),
        database=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"))

    commands = (
        """
        CREATE TABLE matches (
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
        CREATE TABLE players (
            id INTEGER PRIMARY KEY,
            event VARCHAR(2) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            elegible_year INTEGER,
            sex VARCHAR(1) NOT NULL
        )
        """,
        """
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY,
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