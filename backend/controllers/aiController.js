const { GoogleGenerativeAI } = require("@google/generative-ai");

const breakdownTask = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing from environment variables.");
            return res.status(500).json({ message: "AI Service configuration missing. Please check server .env file." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-flash-latest as it is available and stable
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const { title } = req.body;
        if (!title) return res.status(400).json({ message: "Task title is required" });

        const prompt = `You are a project management assistant. Break down the task "${title}" into 3-5 clear, professional technical sub-tasks or steps. Provide the response as a simple bulleted list.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.status(200).json({ breakdown: text });
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        
        // Handle Quota/Rate Limit Errors (429)
        if (error.message.includes("429") || error.message.includes("quota")) {
            return res.status(429).json({ 
                message: "AI Quota Exceeded. The free tier limit has been reached. Please try again in a minute.",
                details: "Google AI Studio limits free tier requests. Consider checking your usage at https://aistudio.google.com/"
            });
        }

        res.status(500).json({ message: "Task breakdown failed.", error: error.message });
    }
};

module.exports = { breakdownTask };
