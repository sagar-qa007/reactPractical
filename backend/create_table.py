import sqlite3

# Connect to SQLite database (create it if not exists)
conn = sqlite3.connect('data/documents.db')
cursor = conn.cursor()

# Create documents table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        position INTEGER NOT NULL
    )
''')

# Commit changes and close connection
conn.commit()
conn.close()
