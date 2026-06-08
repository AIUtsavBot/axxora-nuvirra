export async function generateWithGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("[Gemini Mock] Generating draft response for prompt:", prompt);
    // Return a smart context-based mock reply to make the demo feel fully integrated
    if (prompt.includes("reply") || prompt.includes("response")) {
      return `Thank you for contacting Nuvirra! We appreciate your interest in our premium cookware. Our support team is currently looking into your inquiry, and we'll get back to you shortly with a personalized recommendation. Let us know if you need anything else in the meantime!`;
    }
    return `[Gemini Content Studio Mock]\n1. Hook: "Cook like a pro every single day with the Nuvirra Starter Set. 🍳✨ #kitchengoals"\n2. Caption: "Say goodbye to sticky pans and uneven heating. The Nuvirra Cookware Set is engineered for consistent results, whether you're frying, searing, or simmering. Link in bio to shop!"\n3. Alternative: "Meet the spatula and ladle duo designed to elevate your everyday cooking routine. Crafted for durability and style. 🍲 #NuvirraHome"`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody: any = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Gemini API Error Response]", errText);
      return "Error generating response. Please check Gemini API logs or key configuration.";
    }

    const data = await res.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return textResult ? textResult.trim() : "No content generated from Gemini.";
  } catch (error) {
    console.error("[Gemini API Fetch Exception]", error);
    return "Failed to connect to the Gemini API. Please verify network settings.";
  }
}
