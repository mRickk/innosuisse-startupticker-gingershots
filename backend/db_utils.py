from sqlalchemy import create_engine
import os
from schema_engine import SchemaEngine
import sqlite3
import pandas as pd

db_path = ""

def get_db_abs_path():
    return db_path

def set_db_abs_path(db_filename):
    db_path = os.path.abspath(db_filename)
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file {db_filename} not found.")
    
# TODO: instead of here the view must call the setter
set_db_abs_path("swiss.db")

def create_schema():
    # Get the schema
    db_engine = create_engine(f'sqlite:///{get_db_abs_path()}')

    schema_engine = SchemaEngine(engine=db_engine, db_name="my_database")
    mschema = schema_engine.mschema
    mschema.add_foreign_key("deal", "Company", None, "company", "Title")

    mschema_str = mschema.to_mschema()

    mschema_str = mschema_str.replace("main.", "")
    
    print("MSchema: " + mschema_str)
    #mschema.save(f'./{"my_database"}.json')
    
    return mschema_str

def query_database(query):
    conn = sqlite3.connect(get_db_abs_path())
    
    try:
        result_df = pd.read_sql(query, conn)
        return result_df
        
    finally:
        conn.close()