import sqlite3
import json
import os

from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse
from starlette.routing import Route
import uvicorn
import yaml
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'], allow_headers=['*'], allow_methods=['*'])
]

app = Starlette(middleware=middleware)

DATABASE_FILE = 'data/documents.db'
JSON_FILE = 'data/data.json'

def execute_query(query, values=None):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    if values:
        cursor.execute(query, values)
    else:
        cursor.execute(query)
    conn.commit()
    result = cursor.fetchall()
    conn.close()
    return result

def initialize_database():
    # Remove the existing database file
    if os.path.exists(DATABASE_FILE):
        os.remove(DATABASE_FILE)

    # Connect to the database (this will create a new file)
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    # Create the documents table
    cursor.execute('''
        CREATE TABLE documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            position INTEGER NOT NULL
        )
    ''')

    # Load predefined data from JSON file
    with open(JSON_FILE) as f:
        predefined_data = json.load(f)

    # Insert data into the database
    for item in predefined_data:
        cursor.execute('''
            INSERT INTO documents (type, title, position)
            VALUES (?, ?, ?)
        ''', (item['type'], item['title'], item['position']))

    # Commit changes and close connection
    conn.commit()
    conn.close()

@app.route('/documents', methods=["GET"])
async def fetch_documents(request):
    query = "SELECT * FROM documents;"
    documents = execute_query(query)
    documents = [
        {"id": doc[0], "type": doc[1], "title": doc[2], "position": doc[3]}
        for doc in documents
    ]
    return JSONResponse({"documents": documents})

@app.route('/documents', methods=["POST"])
async def add_document(request):
    data = await request.json()
    query = "INSERT INTO documents (type, title, position) VALUES (?, ?, ?);"
    values = (data["type"], data["title"], data["position"])
    execute_query(query, values)
    return JSONResponse({"message": "Document added successfully", "document": data})

@app.route('/documents/{document_id:int}', methods=["DELETE"])
async def delete_document(request):
    document_id = request.path_params["document_id"]
    query = "DELETE FROM documents WHERE id = ?;"
    values = (document_id,)
    execute_query(query, values)
    return JSONResponse({"message": f"Document {document_id} deleted successfully", "document_id": document_id})

@app.route('/documents/{document_id:int}', methods=["PUT"])
async def update_document_position(request):
    document_id = request.path_params["document_id"]
    data = await request.json()
    new_position = data.get("position")
    if new_position is not None:
        query = "UPDATE documents SET position = ? WHERE id = ?;"
        values = (new_position, document_id)
        execute_query(query, values)
        return JSONResponse({"message": f"Document {document_id} position updated successfully", "document_id": document_id, "new_position": new_position})
    else:
        return JSONResponse({"error": "New position is missing"}, status_code=400)

@app.route('/')
async def homepage(request):
    with open('static/index.html') as f:
        html_content = f.read()
    return HTMLResponse(html_content)

@app.route('/swagger')
async def swagger(request):
    with open('static/swagger.yaml') as f:
        swagger_content = yaml.safe_load(f)
    return JSONResponse(swagger_content)

if __name__ == "__main__":
    initialize_database()
    uvicorn.run(app, host="127.0.0.1", port=5620)
