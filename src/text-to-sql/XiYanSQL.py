
nl2sqlite_template_en = """You are now a {dialect} data analyst, and you are given a database schema as follows:

【Schema】
{db_schema}

【Question】
{question}

【Evidence】
{evidence}

Please read and understand the database schema carefully, and generate an executable SQL based on the user's question and evidence. The generated SQL is protected by ```sql and ```.
"""

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "XGenerationLab/XiYanSQL-QwenCoder-3B-2502"
#model_name = "XGenerationLab/XiYanSQL-QwenCoder-7B-2502"
#model_name = "XGenerationLab/XiYanSQL-QwenCoder-14B-2502"
#model_name = "XGenerationLab/XiYanSQL-QwenCoder-32B-2412"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# load db schema



def generate_sql(self, question, dialect="MySQL", evidence=""):
        """Helper function to generate SQL from natural language question"""
        prompt = nl2sqlite_template_en.format(
            dialect=dialect, 
            db_schema=self.db_schema, 
            question=question, 
            evidence=evidence
        )
        
        message = [{'role': 'user', 'content': prompt}]
        text = self.tokenizer.apply_chat_template(
            message,
            tokenize=False,
            add_generation_prompt=True
        )
        
        model_inputs = self.tokenizer([text], return_tensors="pt").to(self.model.device)
        
        generated_ids = self.model.generate(
            **model_inputs,
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            max_new_tokens=1024,
            temperature=0.1,
            top_p=0.8,
            do_sample=True,
        )
        
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]
        
        return self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
