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
def home(
    option: Optional[str] = Query(None),
    id_editor: Optional[str] = Query(0),
    id_employee: Optional[str] = Query(0),
):
    bbox = sql.db_connect()
    query = f"call sp_createPAF_v2({option},'{id_employee}',{id_editor});"
    results = sql.plane_query_text(bbox, query)
    print(query)

    sql.db_close(bbox)
    return results