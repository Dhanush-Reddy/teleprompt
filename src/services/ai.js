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
            content: `Rewrite the following text to sound like a natural, unscripted human speech.
            - Add *occasional* filler words (um, uh) but do NOT overdo it.
            - Include *very few* mild stutters or repetitions for realism.
            - The goal is to make it feel "live", not "broken" or "drunk".
            - Keep the text readable, coherent, and flow naturally.
            - Do NOT add irrelevant tangents.
            
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

export const getAnswer = async (question, apiKey, context = '') => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const systemPrompt = `You are an expert Senior Python Backend Engineer and AWS Cloud Architect.
    ${context ? `Here is your resume/background context:\n<RESUME>\n${context}\n</RESUME>\n` : ''}
    
    Answer the user's question demonstrating this expertise.
    - If the question asks about "my experience" or "my skills", refer STRICTLY to the <RESUME> context provided.
    - If the question is technical (e.g., "Explain Lambda"), explain it like a Senior Engineer using Python/AWS examples.
    - Keep the answer concise and formatted as a script to be read aloud.
    - Do NOT include pleasantries like "Here is the script".
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Teleprompter App"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Failed to search answer.");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "I couldn't find an answer.";
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error(error.message || "Failed to get answer.");
  }
};
