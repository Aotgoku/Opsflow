const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function readApiKey() {
    try {
        const envPath = path.join(__dirname, "../../.env");
        const content = fs.readFileSync(envPath, "utf-8");
        const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
        return match ? match[1].trim() : null;
    } catch {
        return process.env.GEMINI_API_KEY || null;
    }
}

const breakdownTask = async (req, res) => {
    try {
        const apiKey = readApiKey();
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY not found in .env" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const { title } = req.body;
        if (!title) return res.status(400).json({ message: "Task title is required" });

        const prompt = `You are a project management assistant. Break down the task "${title}" into 3-5 clear, professional technical sub-tasks or steps. Provide the response as a simple bulleted list.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.status(200).json({ breakdown: text });
    } catch (error) {
        console.error("Generation Error:", error.message);
        res.status(500).json({ message: "Task breakdown failed.", error: error.message });
    }
};

module.exports = { breakdownTask };
