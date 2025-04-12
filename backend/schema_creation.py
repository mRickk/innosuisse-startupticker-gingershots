from sqlalchemy import create_engine
import os
from schema_engine import SchemaEngine

def create_schema():
    # Get the schema
    db_path = "backend/my_database.db" 
    abs_path = os.path.abspath(db_path)
    db_engine = create_engine(f'sqlite:///{abs_path}')

    schema_engine = SchemaEngine(engine=db_engine, db_name="my_database")
    mschema = schema_engine.mschema
    mschema_str = mschema.to_mschema()

    mschema_str = mschema_str.replace("main.", "")
    
    print("MSchema: " + mschema_str)
    #mschema.save(f'./{"my_database"}.json')
    
    return mschema_str