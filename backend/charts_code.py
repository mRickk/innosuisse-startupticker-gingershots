from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from huggingface_hub import login
from openai import OpenAI
import json

token = ""
with open("hf/hf_access_token.txt", 'r') as file:
    token = file.read().strip()
    login(token=token)

# THIS FUNCTION WILL BE CHANGED IN THE API BRANCH
def generate_charts_code(question, query, df):
    df = df.to_string()


    input_text = f"""You are a data analyst tasked with creating interactive visualizations.

    You are provided with:
    - An original user question ({question})
    - The corresponding database query ({query})
    - A Pandas DataFrame containing the retrieved data ({df})

    Using this DataFrame, write JavaScript code utilizing Chart.js to generate visually appealing, interactive charts. Follow these guidelines strictly:

    - No dependencies: Write clean, executable JavaScript code ready to be integrated directly into a React web application without additional setup.
    - Provide exactly three charts: Select only the three most promising chart types that best represent the provided data from options such as bar plot, bubble chart, pie chart, maps, heat map matrices, line charts, radar charts, scatter plots, etc.
    - Clear structure: Each chart must follow the structure provided in the dummy React example below.

    Example format (dummy example):
        
    <div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">
        <h5 className="text-lg font-medium text-gray-800 mb-4">Pending Transactions</h5>
        <Bar data={{{{
            labels: ['Page A', 'Page B', 'Page C', 'Page D', 'Page E'],
            datasets: [
                {{
                    label: 'Visits',
                    data: [4000, 3000, 2000, 2780, 1890],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }},
            ],
        }}}} />
    </div>

    Your response must:

    - Include the JSX/React chart component code (code).
    - Provide a concise, insightful description (description) of each chart, clearly explaining what it visually represents and why this chart type was chosen for the given data.

    Response format (strictly adhere to this JSON structure):

    [{{"code": "<React JSX component code for chart 1>",
        "description": "<Concise description of chart 1>"}},

        {{"code": "<React JSX component code for chart 2>",
        "description": "<Concise description of chart 2>"}},

        {{"code": "<React JSX component code for chart 3>",
        "description": "<Concise description of chart 3>"}}]

    The output is MUST BE parsed as a JSON, visually appealing, and clearly explains each visualization's purpose and insights derived from the DataFrame data."""



    client = OpenAI(
            base_url = "https://s504xedw0gl21xfx.us-east-1.aws.endpoints.huggingface.cloud/v1/",
            api_key = token # Replace with your actual API key
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
        max_tokens=10000,
        stream=True,
        seed=None,
        stop=None,
        frequency_penalty=None,
        presence_penalty=None
    )

    response = ""
    for message in chat_completion:
        response += message.choices[0].delta.content

    response = response.split("</think>")[1]
    response = response.replace("'''","")
    response = response.replace("json","")
    response = response.replace("```","")

    print(response)
    if "[{" in response:
        response = response.split("[{", 1)[-1]
    if "}]" in response:
        response = response.rsplit("}]", 1)[0] + "}]"
    
    try:
        # Try to parse the response as JSON
        parsed_response = json.loads(response)
        return parsed_response
    except json.JSONDecodeError:
        # If parsing fails, log the error and return the raw response
        print("Warning: Failed to parse response as JSON. Returning raw response.")
        return response