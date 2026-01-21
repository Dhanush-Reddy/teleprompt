export const humanizeText = async (text, apiKey) => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "Teleprompter Training App", // Optional
        "X-Title": "Teleprompter App"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Using a fast, reliable model
        messages: [
          {
            role: "system",
            content: "You are a script editor. Rewrite text to sound like imperfect human speech. Output only the raw text."
          },
          {
            role: "user",
            content: `Rewrite the following text to make it sound like an imperfect human speech or live transcription. 
            Add realistic "human" elements such as:
            - Occasional stuttering (repeating the first letter of a word, e.g., "th-this").
            - Filler words like "um", "uh", "ah", "you know".
            - Minor grammar slips or self-corrections (e.g., "I went to... uh, I mean, I drove to").
            - Keep the core meaning intact, but make the rhythm less robotic.
            
            Return ONLY the rewritten text. Do not include any explanations or quotes around the result.
            
            Original Text:
            "${text}"`
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Failed to fetch from OpenRouter");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error(error.message || "Failed to humanize text.");
  }
};
