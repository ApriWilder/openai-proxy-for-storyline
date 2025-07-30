from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

MODELS = [
    "openai/gpt-4o",
    "anthropic/claude-3-haiku",
    "meta-llama/llama-3-70b-instruct",
    "mistralai/mistral-7b-instruct",
    "google/gemini-pro"
]

def query_model(model, prompt):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
    }
    response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)
    return response.json()["choices"][0]["message"]["content"]

@app.route("/compete", methods=["POST"])
def compete():
    data = request.get_json()
    prompt = data.get("prompt", "")

    results = {}
    for model in MODELS:
        try:
            result = query_model(model, prompt)
            results[model] = result
        except Exception as e:
            results[model] = f"Error: {str(e)}"

    # Optional: Add ranking or selection logic here
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
