async function sendToAI() {
    const userInput = document.getElementById("inputBox").value;

    const response = await fetch("/.netlify/functions/ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userInput
        })
    });

    const data = await response.json();

    document.getElementById("outputBox").innerText =
        data.choices[0].message.content;
}