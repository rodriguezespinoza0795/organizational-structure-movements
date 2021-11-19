import json
from fastapi import FastAPI, Query
from db import connection as sql
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/paf/")
def home():
    bbox = sql.db_connect()
    
    query = f"select * from e_employee where id_employee=108294;"

    results = sql.plane_query_text(bbox, query)

    sql.db_close(bbox)
    return results