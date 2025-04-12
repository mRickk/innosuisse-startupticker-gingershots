from sqlalchemy import create_engine
import os
from schema_engine import SchemaEngine
import sqlite3
import pandas as pd

def get_db_abs_path():
    db_path = "./my_database.db" 
    return os.path.abspath(db_path)

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