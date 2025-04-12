import pandas as pd
import sqlite3

excel_file = './data/Data-startupticker.xlsx'  
sheet1 = 'Companies'  
sheet2 = 'Deals'

# Read Excel sheets
df1 = pd.read_excel(excel_file, sheet_name=sheet1)
df2 = pd.read_excel(excel_file, sheet_name=sheet2)

# Df preprocessing
df1 = df1.drop_duplicates(subset="Title", keep="first")

# Connect to DB
conn = sqlite3.connect('my_database.db')
conn.execute("PRAGMA foreign_keys = ON;")
cursor = conn.cursor()

# Drop tables if they exist
cursor.execute("DROP TABLE IF EXISTS table2")
cursor.execute("DROP TABLE IF EXISTS table1")
cursor.execute("DROP TABLE IF EXISTS deal")
cursor.execute("DROP TABLE IF EXISTS company")


# Create table1
cursor.execute('''
    CREATE TABLE company (
        Code TEXT,
        Title TEXT PRIMARY KEY,
        Industry TEXT,
        Vertical TEXT,
        Canton TEXT,
        "Spin-offs" TEXT,
        City TEXT,
        Year INTEGER,
        Highlights TEXT,
        "Gender CEO" TEXT,
        OOB BOOLEAN,
        Funded BOOLEAN,
        Comment TEXT
    )
''')

# Create table2 with foreign key to table1.Title
cursor.execute('''
    CREATE TABLE deal (
        Id TEXT PRIMARY KEY,
        Investors TEXT,
        Amount REAL,
        Valuation REAL,
        Comment TEXT,
        URL TEXT,
        Confidential BOOLEAN,
        "Amount confidential" BOOLEAN,
        "Date of the funding round" TEXT,
        Type TEXT,
        Phase TEXT,
        Canton TEXT,
        Company TEXT,
        "Gender CEO" TEXT,
        FOREIGN KEY (Company) REFERENCES company(Title)
    )
''')

# Insert data from DataFrames
df1.to_sql('company', conn, if_exists='append', index=False)
df2.to_sql('deal', conn, if_exists='append', index=False)
