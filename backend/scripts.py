from pandas import DataFrame
from XiYanSQL import generate_sql
from charts_code import generate_charts_code
from db_utils import query_database

class Scripts:
    """
    This class contains main methods of the backend.
    """

    def __init__(self):
        pass

    def generate_sql(self, question: str) -> str:
        """
        Generate SQL query from a natural language question.
        """
        return generate_sql(question)

    def query_database(self, sql: str) -> DataFrame:
        """
        Query the database with the generated SQL query.
        """
        return query_database(sql)

    def generate_charts_code(self, question: str, sql: str, df) -> str:
        """
        Generate charts code based on the question, SQL query and retrieved data.
        """
        return generate_charts_code(question, sql, df)