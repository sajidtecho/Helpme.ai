const { GoogleGenAI, Type } = require("@google/genai");

// Resolve API Key
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY or GOOGLE_API_KEY is not defined in your backend .env file!");
}

const ai = new GoogleGenAI({
    apiKey: apiKey,
});


// gemini Schema Definitions 

const technicalQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        answer: { type: Type.STRING },
        feedback: { type: Type.STRING },
        rating: { type: Type.INTEGER },
        intention: { type: Type.STRING },
        keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        confidenceScore: { type: Type.INTEGER }
    },
    required: ["question", "answer", "feedback", "rating", "intention", "keyStrengths", "keyWeaknesses", "confidenceScore"]
};

const behaviouralQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        answer: { type: Type.STRING },
        feedback: { type: Type.STRING },
        rating: { type: Type.INTEGER },
        intention: { type: Type.STRING },
        keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        confidenceScore: { type: Type.INTEGER }
    },
    required: ["question", "answer", "feedback", "rating", "intention", "keyStrengths", "keyWeaknesses", "confidenceScore"]
};

const preparationPlanSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        description: { type: Type.STRING },
        status: { type: Type.STRING },
        deadline: { type: Type.STRING },
        resources: { type: Type.ARRAY, items: { type: Type.STRING } },
        confidence: { type: Type.STRING },
        feedback: { type: Type.STRING },
        explanation: { type: Type.STRING },
        task: { type: Type.STRING }
    },
    required: ["topic", "description", "status", "deadline", "resources", "confidence", "feedback", "explanation", "task"]
};

const skillGapSchema = {
    type: Type.OBJECT,
    properties: {
        skill: { type: Type.STRING },
        severity: { type: Type.STRING },
        explanation: { type: Type.STRING }
    },
    required: ["skill", "severity", "explanation"]
};

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        jobDescription: { type: Type.STRING },
        resumeText: { type: Type.STRING },
        selfDescription: { type: Type.STRING },
        technicalQuestion: { type: Type.ARRAY, items: technicalQuestionSchema },
        behaviouralQuestion: { type: Type.ARRAY, items: behaviouralQuestionSchema },
        preparationPlan: { type: Type.ARRAY, items: preparationPlanSchema },
        skillGap: { type: Type.ARRAY, items: skillGapSchema },
        weakness: { type: Type.ARRAY, items: { type: Type.STRING } },
        strength: { type: Type.ARRAY, items: { type: Type.STRING } },
        score: { type: Type.INTEGER },
        overall: { type: Type.STRING }
    },
    required: [
        "jobDescription",
        "resumeText",
        "selfDescription",
        "technicalQuestion",
        "behaviouralQuestion",
        "preparationPlan",
        "skillGap",
        "weakness",
        "strength",
        "score",
        "overall"
    ]
};

/**
 * Generates an Interview Report using Gemini 2.5 Flash.
 * @param {string} jobDescription
 * @param {string} resumeText
 * @param {string} selfDescription
 * @returns {Promise<Object>} The parsed report object matching the Mongoose schema.
 */
async function generateInterviewReport(jobDescription, resumeText, selfDescription) {
    try {
        console.log("🤖 Invoking Gemini 2.5 Flash for structured interview analysis...");

        if (!apiKey) {
            throw new Error("Gemini API key is not configured. Please add GEMINI_API_KEY or GOOGLE_API_KEY to your Backend .env file.");
        }

        const promptText = `You are an expert AI interviewer and technical recruiter with 10+ years of hiring experience.
Analyze the candidate's details and the job requirements, and generate a structured JSON interview report.

Job Description:
${jobDescription || "Not provided"}

Resume Text:
${resumeText || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Requirements:
1. Technical Questions: Generate 5 relevant technical questions with sample answers, ratings, intent, strengths/weaknesses, and confidence scores.
2. Behavioral Questions: Generate 5 relevant behavioral questions with similar detail.
3. Preparation Plan: Generate a 7-day preparation plan to close any found gaps.
4. Skill Gap: Highlight gaps between the job description and candidate resume.
5. Weakness: Compile a list of candidate weaknesses.
6. Strength: Compile a list of candidate strengths.
7. Score: Compute an overall ATS compatibility score (0-100).
8. Overall: Provide a concluding evaluation summary.`;

        // Request structured JSON output using Gemini SDK
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptText,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            }
        });

        const reportData = JSON.parse(response.text);
        console.log("✨ Structured Interview Report generated successfully!");
        return reportData;
    } catch (error) {
        console.error("❌ Gemini generateInterviewReport Error:", error.message || error);
        throw error;
    }
}

module.exports = generateInterviewReport;
