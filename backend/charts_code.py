from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from huggingface_hub import login

with open("hf/hf_access_token.txt", 'r') as file:
    token = file.read().strip()
login(token=token)

# tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("deepseek-ai/deepseek-coder-1.3b-base", trust_remote_code=True).cuda()

pipe = pipeline(
    "Charts code generation using Charts.js and textual description generation",
    model="meta-llama/Llama-3.2-3B", 
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

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
    # inputs = tokenizer(input_text, return_tensors="pt").cuda()
    # outputs = model.generate(**inputs, max_length=128)
    # response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = pipe(
            input_text,
            max_new_tokens=1000,        # Control the length of generated text
            do_sample=True,            # Use sampling (more creative)
            temperature=0.7,           # Control randomness (higher = more random)
            top_p=0.9,                 # Nucleus sampling parameter
            return_full_text=False     # Only return the generated text, not the prompt
        )[0]['generated_text']
    return response