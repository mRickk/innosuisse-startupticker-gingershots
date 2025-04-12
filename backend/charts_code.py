from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True).cuda()

def generate_charts_code(question, query, df):
    input_text = """You are a data analyst.
    You are given the original user question, the corresponding database query and a Pandas dataframe of the retrieved data.
    Starting from the dataframe data, write JavaScript code using Charts.js to generate interactive charts (multiple if needed) that are relevant to the data.
    Do not put dependencies, just write the code that can be run directly inside another web application.

    【Question】
    {question}

    【Query】
    {query}

    【Dataframe】
    {df}

    【Charts.js Code】    
    """
    inputs = tokenizer(input_text, return_tensors="pt").cuda()
    outputs = model.generate(**inputs, max_length=128)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response