import pandas as pd
import sqlite3
import os
from db_utils import get_db_abs_path

excel_file = './data/Data-crunchbase.xlsx'
abs_path = os.path.abspath(excel_file)
sheet1 = 'organizations'
sheet2 = 'funding rounds'

df1 = pd.read_excel(excel_file, sheet_name=sheet1)
df2 = pd.read_excel(excel_file, sheet_name=sheet2)
df1 = df1.drop_duplicates(subset="uuid", keep="first")

# Connect to SQLite DB
conn = sqlite3.connect('world.db')
conn.execute("PRAGMA foreign_keys = ON;")
cursor = conn.cursor()

# Drop tables if they exist
cursor.execute("DROP TABLE IF EXISTS organizations")
cursor.execute("DROP TABLE IF EXISTS funding_rounds")

# Create tables with primary and foreign keys

cursor.execute("""
CREATE TABLE IF NOT EXISTS organizations (
    uuid TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    permalink TEXT,
    cb_url TEXT,
    rank INTEGER,
    created_at DATE,
    updated_at DATE,
    legal_name TEXT,
    roles TEXT,
    domain TEXT,
    homepage_url TEXT,
    country_code TEXT,
    state_code TEXT,
    region TEXT,
    city TEXT,
    address TEXT,
    postal_code TEXT,
    status TEXT,
    short_description TEXT,
    category_list TEXT,
    category_groups_list TEXT,
    num_funding_rounds REAL,
    total_funding_usd REAL,
    total_funding REAL,
    total_funding_currency_code TEXT,
    founded_on DATE,
    last_funding_on DATE,
    closed_on DATE,
    employee_count TEXT,
    email TEXT,
    phone TEXT,
    facebook_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    logo_url TEXT,
    alias1 TEXT,
    alias2 TEXT,
    alias3 TEXT,
    primary_role TEXT,
    num_exits REAL
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS funding_rounds (
    uuid TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    permalink TEXT,
    cb_url TEXT,
    rank INTEGER,
    created_at DATE,
    updated_at DATE,
    country_code TEXT,
    state_code TEXT,
    region TEXT,
    city TEXT,
    investment_type TEXT,
    announced_on DATE,
    raised_amount_usd REAL,
    raised_amount REAL,
    raised_amount_currency_code TEXT,
    post_money_valuation_usd REAL,
    post_money_valuation REAL,
    post_money_valuation_currency_code TEXT,
    investor_count REAL,
    org_uuid TEXT,
    org_name TEXT,
    lead_investor_uuids TEXT,
    FOREIGN KEY (org_uuid) REFERENCES organizations(uuid)
);
""")

df1.to_sql('organizations', conn, if_exists='append', index=False)
df2.to_sql('funding_rounds', conn, if_exists='append', index=False)

conn.close()
