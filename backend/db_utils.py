from sqlalchemy import create_engine
import os
from schema_engine import SchemaEngine
import sqlite3
import pandas as pd

# TODO: instead of here the view must call the setter
db_name = "swiss.db"

def set_db_abs_path(db_filename):
    global db_name
    db_name = db_filename
    db_path = os.path.abspath(db_filename)
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file {db_filename} not found.")

def get_db_abs_path():
    return os.path.abspath(db_name)
    
def create_schema():
    # Get the schema
    db_engine = create_engine(f'sqlite:///{get_db_abs_path()}')

    schema_engine = SchemaEngine(engine=db_engine, db_name=db_name)
    mschema = schema_engine.mschema

    if db_name == "swiss.db":
        mschema.add_foreign_key("deal", "Company", None, "company", "Title")
    else:
        mschema.add_foreign_key("funding_rounds", "org_uuid", None, "organization", "uuid")

    mschema_str = mschema.to_mschema()

    # Hardcoded fix for the schema name
    mschema_str = mschema_str.replace("main.", "")
    
    print("MSchema: " + mschema_str)
    
    return mschema_str

def query_database(query):
    conn = sqlite3.connect(get_db_abs_path())
    
    try:
        result_df = pd.read_sql(query, conn)
        return result_df
        
    finally:
        conn.close()