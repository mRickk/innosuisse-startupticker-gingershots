from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from huggingface_hub import login
from openai import OpenAI

with open("hf/hf_access_token.txt", 'r') as file:
    token = file.read().strip()
login(token=token)

# tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True).cuda()

pipe = pipeline(
    "text-generation",
    model="meta-llama/Llama-3.2-3B", 
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

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
    {"code": "<insert code>", "description": "<insert description>"}
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
            "content": input_text
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

    return response