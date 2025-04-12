import unittest
from XiYanSQL import generate_sql

class TestTextToSQL(unittest.TestCase):

    def test_company_count_by_industry(self):
        question = "How many companies are there in each industry?"
        sql = generate_sql(question)
        print(f"\nQuestion: {question}\nGenerated SQL: {sql}")
        self.assertTrue("SELECT" in sql and "COUNT" in sql and "GROUP BY" in sql)
        # self.assertEqual("SELECT industry, COUNT(DISTINCT company) AS number_of_companies FROM company GROUP BY industry;", sql)

    def test_highest_valued_deals(self):
        question = "What are the top 10 highest valued deals?"
        sql = generate_sql(question)
        print(f"\nQuestion: {question}\nGenerated SQL: {sql}")
        self.assertTrue("SELECT" in sql and "ORDER BY" in sql and "LIMIT" in sql)

    def test_gender_distribution(self):
        question = "Provide the distribution of companies by CEO gender"
        sql = generate_sql(question)
        print(f"\nQuestion: {question}\nGenerated SQL: {sql}")
        self.assertTrue("SELECT" in sql and "Gender CEO" in sql)

    def test_funding_by_canton(self):
        question = "What is the total funding amount by canton?"
        sql = generate_sql(question)
        print(f"\nQuestion: {question}\nGenerated SQL: {sql}")
        self.assertTrue("SELECT" in sql and "SUM" in sql and "GROUP BY" in sql)
        # self.assertEqual("SELECT canton, SUM(amount) AS total_funding_amount FROM deal GROUP BY canton;", sql)

    def test_join_companies_deals(self):
        question = "List companies founded after 2018 that have received at least one investment"
        sql = generate_sql(question)
        print(f"\nQuestion: {question}\nGenerated SQL: {sql}")
        self.assertTrue("SELECT" in sql and "JOIN" in sql and "WHERE" in sql)

if __name__ == "__main__":
    unittest.main()