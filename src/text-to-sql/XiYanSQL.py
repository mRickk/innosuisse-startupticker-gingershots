
nl2sqlite_template_en = """You are a {dialect} generation model. You will be given a question and a database schema. Your task is to generate a {dialect} query that answers the question based on the provided database schema.
Question:
{question}

Database Schema:
{db_schema}

Evidence:
{evidence}

Question:
{question}

```sql"""

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "XGenerationLab/XiYanSQL-QwenCoder-3B-2502"
model_name = "XGenerationLab/XiYanSQL-QwenCoder-7B-2502"
model_name = "XGenerationLab/XiYanSQL-QwenCoder-14B-2502"
model_name = "XGenerationLab/XiYanSQL-QwenCoder-32B-2412"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

tokenizer = AutoTokenizer.from_pretrained(model_name)

## dialects -> ['SQLite', 'PostgreSQL', 'MySQL']
prompt = nl2sqlite_template_en.format(dialect="MySQL", db_schema="", question="", evidence="")
message = [{'role': 'user', 'content': prompt}]

text = tokenizer.apply_chat_template(
    message,
    tokenize=False,
    add_generation_prompt=True
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

generated_ids = model.generate(
    **model_inputs,
    pad_token_id=tokenizer.pad_token_id,
    eos_token_id=tokenizer.eos_token_id,
    max_new_tokens=1024,
    temperature=0.1,
    top_p=0.8,
    do_sample=True,
)
generated_ids = [
    output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
]
response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
