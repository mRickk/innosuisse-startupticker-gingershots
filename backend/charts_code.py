from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from huggingface_hub import login
from openai import OpenAI
import json

with open("hf/hf_access_token.txt", 'r') as file:
    token = file.read().strip()
    login(token=token)

# THIS FUNCTION WILL BE CHANGED IN THE API BRANCH
def generate_charts_code(question, query, df):
    input_text = """You are a data analyst.
    You are given the original user question, the corresponding database query and a Pandas dataframe of the retrieved data.
    Starting from the dataframe data, write JavaScript code using Charts.js to generate interactive charts (multiple if needed) that are relevant to the data.
    Do not put dependencies, just write the code that can be run directly inside another web application.
    Then give a short description of the charts you created and what they represent.

    【Question】
    {question}

    【Query】
    {query}

    【Dataframe】
    {df}
    

    Output following this format:
    [{"code": "<insert code 1>", "description": "<insert description 1>"}, {"code": "<insert code 2>", "description": "<insert description 2>"}, ...]
    """

    client = OpenAI(
            base_url = "https://mjc2xhrx4nq9sqbo.us-east-1.aws.endpoints.huggingface.cloud/v1/",
            api_key = "" # Replace with your actual API key
        )

    chat_completion = client.chat.completions.create(
        model="tgi",
        messages=[
        {
            "role": "user",
            "content": "Tell me about Zurich"
        }
    ],
        top_p=None,
        temperature=None,
        max_tokens=150,
        stream=True,
        seed=None,
        stop=None,
        frequency_penalty=None,
        presence_penalty=None
    )

    response = ""
    for message in chat_completion:
        response += message.choices[0].delta.content

    try:
        # Try to parse the response as JSON
        parsed_response = json.loads(response)
        return parsed_response
    except json.JSONDecodeError:
        # If parsing fails, log the error and return the raw response
        print("Warning: Failed to parse response as JSON. Returning raw response.")
        return response