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
    option: Optional[str] = Query(0),
    id_editor: Optional[str] = Query(0),
    id_employee: Optional[str] = Query(0),
    id_position: Optional[str] = Query(0),
    paftype: Optional[str] = Query(0),
    value: Optional[str] = Query(''),
    post_param: Optional[str] = Query(None),
):
    
    if post_param :
        bbox = sql.db_connect()
        query = f"call sp_createPAF_v2({option},'{post_param}',{id_editor});"
        results = sql.plane_query_text(bbox, query)
        print(query)

        sql.db_close(bbox)
        return results
    else :  
        bbox = sql.db_connect()
        query = f"call sp_createPAF_v2({option},'{id_employee}|-|{value}|-|{id_position}|-|{paftype}',{id_editor});"
        results = sql.plane_query_text(bbox, query)
        print(query)

        sql.db_close(bbox)
        return results