import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, refinement, model, style, goal, task } = req.body;

  if (!prompt && !refinement) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error:
        "GROQ_API_KEY is not configured. Add it to your Vercel environment variables.",
    });
  }

  const systemPrompt = `You are an expert prompt engineer. Your task is to take a user's rough prompt idea and rewrite it as a highly optimized, professional prompt.

Optimization goal: ${goal || "Maximize accuracy"}
Task type: ${task || "General"}
Output style: ${
    style === "ask"
      ? "Question/Ask format (single-turn)"
      : style === "system"
      ? "System prompt format"
      : style === "chain"
      ? "Include chain-of-thought reasoning steps"
      : "Direct instruction format"
  }

Rules:
- Return ONLY the optimized prompt text. No explanations, no preamble, no "Here is the optimized prompt:".
- Make it clear, specific, and effective for the stated goal and task type.
- Add structure where helpful (numbered steps, role assignment, output format specs).
- For "Minimize tokens" goal: be extremely concise. For "Maximize accuracy": be thorough and precise.
- For "Creative" goal: include creative latitude instructions. For "Deterministic": specify exact output format.`;

  const userMessage = refinement
    ? `Apply this refinement to the prompt below:\nRefinement: ${refinement}\n\nPrompt:\n"${prompt}"`
    : `Optimize this prompt:\n\n"${prompt}"`;

  try {
    const completion = await client.chat.completions.create({
      model: model || "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const result = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({
      error: error.message || "Failed to optimize prompt",
    });
  }
}
