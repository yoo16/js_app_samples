const resultBox = document.getElementById("result");

const MODEL_URI = "https://api-inference.huggingface.co/models/cyberagent/open-calm-3b";

async function generateText() {
    const prompt = document.getElementById("prompt").value;
    resultBox.textContent = "生成中...";

    const response = await fetch(MODEL_URI, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HUGGING_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
    });

    const result = await response.json();
    resultBox.textContent = JSON.stringify(result, null, 2);
}
