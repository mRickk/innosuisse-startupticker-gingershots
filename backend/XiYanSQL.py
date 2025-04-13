from db_utils import create_schema
from openai import OpenAI
from huggingface_hub import login


with open("hf/hf_access_token.txt", 'r') as file:
    token = file.read().strip()
login(token=token)


nl2sqlite_template_en = """You are now a {dialect} data analyst, and you are given a database schema as follows:

【Schema】
{db_schema}

【Question】
{question}

【Evidence】
{evidence}

Please read and understand the database schema carefully, and generate an executable SQL based on the user's question and evidence. The generated SQL is protected by ```sql and ```.
"""

db_schema = create_schema()

def generate_sql(question, dialect="MySQL", evidence=""):    
    
    prompt = nl2sqlite_template_en.format(
        dialect=dialect, 
        db_schema=db_schema, 
        question=question, 
        evidence=evidence
    )
    
    
    client = OpenAI(
		base_url = "https://u75p7n4mm8gm8bj8.us-east-1.aws.endpoints.huggingface.cloud/v1/",
		api_key = token
	)

    chat_completion = client.chat.completions.create(
        model="tgi",
        messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
        top_p=None,
        temperature=None,
        max_tokens=300,
        stream=True,
        seed=None,
        stop=None,
        frequency_penalty=None,
        presence_penalty=None
    )

    response = ""
    for message in chat_completion:
        response += message.choices[0].delta.content

    return response