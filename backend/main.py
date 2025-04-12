import os
import logging
import pandas as pd
import scripts

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import io
import json

from fastapi import UploadFile, File, Form


# *****************************************************************************
#                  Some global constants and variables
# *****************************************************************************

NAME = ""
VERSION = '1.1.0'
DESCRIPTION = ""
DATA_PATH: str = 'data/'
URL_PREFIX: str = os.getenv("URL_PREFIX") or ""
SERVER_ADDRESS: str = os.getenv("SERVER_ADDRESS") or ""
scripts = None

# *****************************************************************************
#                  FastAPI entry point declaration
# *****************************************************************************

app = FastAPI(title=NAME, version=VERSION,
              description=DESCRIPTION, openapi_url='/specification')

app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# *****************************************************************************
#                  Set the logging for the service
# *****************************************************************************

logger = logging.getLogger("uvicorn.error")
logger.info('Starting app with URL_PREFIX=' + URL_PREFIX)

# ******************************************************************************
#             Classes declaration - for input and output models
# ******************************************************************************


class NameYourBaselModel(BaseModel):
    name: str

# *****************************************************************************
#                  Done once when micro-service is starting up
# *****************************************************************************


async def startup_event():
    scripts = scripts.Scripts()
    return None

app.add_event_handler("startup", startup_event)

# ******************************************************************************
#                  API Route definition
# ******************************************************************************


@app.get("/")
def info():
    return {'message': 'Welcome newcomer. Try out /showcase for the showcase and /docs for the doc.'}

# ******************************************************************************
#                  API Endpoints
# ******************************************************************************


# ******************************************************************************
#                  API Utility functions
# ******************************************************************************

@app.get("/api/search")
def search(query: str):
    """
    Search for a query in the database and return the results.
    """
    sql = scripts.generate_sql(query)
    df = scripts.query_database(sql)
    charts_code = scripts.generate_charts_code(query, sql, df)
    return JSONResponse(content={"sql": sql, "charts_code": charts_code})


@app.post("/data-swiss/")
def upload_excel_swiss():
    try:
        excel_file = './data/Data-startupticker.xlsx'  
        abs_path = os.path.abspath(excel_file)
        sheet1 = 'Companies'  
        sheet2 = 'Deals'

        df1 = pd.read_excel(abs_path, sheet_name=sheet1)
        df2 = pd.read_excel(abs_path, sheet_name=sheet2)

        df1 = df1.drop_duplicates(subset="Title", keep="first")
        df = pd.merge(df1, df2, how='left', left_on='Title', right_on='Company')

        df = json.loads(df.to_json(orient='records',indent=4))
        
        return df
    except Exception as e:
        return f"Error: {e}"




@app.post("/data-world/")
def upload_excel_world():
    try:
        excel_file = './data/Data-crunchbase.xlsx'  
        abs_path = os.path.abspath(excel_file)
        sheet1 = 'organizations'  
        sheet2 = 'funding rounds'

        df1 = pd.read_excel(abs_path, sheet_name=sheet1)
        df2 = pd.read_excel(abs_path, sheet_name=sheet2)

        df1 = df1.drop_duplicates(subset="uuid", keep="first")
        df = pd.merge(df1, df2, how='left', left_on='uuid', right_on='org_uuid')

        df = json.loads(df.to_json(orient='records',indent=4))
        
        return df
    except Exception as e:
        return f"Error: {e}"