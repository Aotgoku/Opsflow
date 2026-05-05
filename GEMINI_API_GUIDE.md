# Gemini API: Stable Implementation Guide

This guide provides the exact model names and configurations that are reliable for free-tier users to avoid the common `429 (Quota)` and `404 (Not Found)` errors.

## 1. Most Stable Model Names (Use these)
When initializing the model in your code, use these specific strings. They are the most widely supported across different API versions.

*   **`gemini-1.5-flash`**: The standard high-speed, free-tier friendly model.
*   **`gemini-flash-latest`**: An alias that always points to the most recent stable version of Flash. (Highly recommended for stability).
*   **`gemini-1.5-pro`**: Higher intelligence, but has much stricter rate limits on the free tier.

## 2. API Versioning
The Google Generative AI SDK usually defaults to a specific version, but if you are making raw fetch calls:
*   **Production:** `v1`
*   **Latest Features:** `v1beta` (e.g., `https://generativelanguage.googleapis.com/v1beta/...`)

## 3. Free Tier Limits (The "429" Error)
The free tier is generous but has strict "Rate Limits." If you see a `429` error, it means you are sending requests too fast.
*   **Requests per minute (RPM):** ~15 requests.
*   **Requests per day (RPD):** ~1,500 requests.
*   **Wait time:** If you hit the limit, wait 60 seconds before trying again.

## 4. Avoiding the "404 Not Found" Error
This happens when you use a model name that doesn't exist or isn't available to your specific key yet (like new experimental models).
*   **Fix:** Always use `gemini-flash-latest` or `gemini-1.5-flash`.
*   **Diagnostics:** You can always check what models *your* key supports by calling the `listModels()` method in the SDK.

## 5. Implementation Template (Node.js)
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Initialize with your API Key
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

// 2. Use 'gemini-flash-latest' for the best balance of speed and availability
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const prompt = "Write a short poem about coding.";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    if (error.message.includes("429")) {
      console.error("QUOTA ERROR: You are sending requests too fast for the free tier.");
    } else if (error.message.includes("404")) {
      console.error("MODEL ERROR: The model name you used is not supported.");
    } else {
      console.error("API ERROR:", error.message);
    }
  }
}
```

## 6. Pro-Tips for Future Projects
1.  **Check AI Studio:** Go to [Google AI Studio](https://aistudio.google.com/) to test your prompts and check your quota usage.
2.  **Environment Variables:** Never hardcode your API key. Always use a `.env` file.
3.  **Error Handling:** Always wrap your AI calls in a `try/catch` block to handle network or quota issues gracefully.
