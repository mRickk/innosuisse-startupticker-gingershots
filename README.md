# Personalised Trend Recoginition and Bernchmarking Tool
## Innosuisse & StartUpTicker - Talk to your data

Natural language input that connects to a SQL database, transforming text into queries to generate customized visuals based on the user’s needs. It also produces a one-pager report that provides insights into market trends for startup founders and benchmarking data for investors.

## Structure Overview

```
├── backend
│   ├── sql_creation         
│   ├── schema_creation      
│   ├── text_to_query_translation
│   └── data
│       ├── crunchbase         
│       └── startupticker      
└── frontend
    ├── public                 
    └── src
        ├── theme              
        ├── assets             
        ├── components         
        ├── helpers            
        └── pages   
```
## Logic

1. Database Creation:
The process starts by constructing an SQL database. We combine data from various Excel sheets (joining multiple pages) to build a unified and structured database.

2. User Query Input:
On the frontend, users enter a natural language prompt. This input is then translated into an SQL query using an open-source LLM (LLama), which retrieves the corresponding data from our SQL database.

3. Data Processing & Dashboard Generation:
The retrieved data, along with the original user prompt, is sent to the backend. Here, another state-of-the-art open-source LLM (Deepsek) processes the information and generates a JSON file. This file contains all the necessary code to render a personalized dashboard for the specific query.

4. Frontend Display & Additional Options:
The generated dashboard is displayed on the React-based frontend. Simultaneously, users have the option to download the data and generate a one-page PDF report. This report offers tailored insights into market trends for startup founders and benchmarking data for investors, effectively providing a personalized Swiss startup radar.

## Running the code

First, make sure to make sure to `pip install -r requirements.txt`.

To run the backend everything has to be done from the CLI (don't worry about this), to run the front you shall go to `frontend/src/` and run `nvm start`.

You will be prompeted with a text box to get your prompt, once the prompt has been executed you will see 2 tabs: the benchmark which includes charts about general information and the search engine which includes your customised charts, you will have the option to download the dataset you asked for in a CSV file and a 1-pager report in a PDF file.
