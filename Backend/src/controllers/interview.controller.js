const InterviewReport = require("../models/interviewReport.modal");
const generateInterviewReport = require("../services/ai.service");

/**
 * @name createReportController
 * @description Generates a structured interview report via Gemini and saves it to MongoDB.
 * @access Private
 */
async function createReportController(req, res) {
    const { jobDescription, resumeText, selfDescription } = req.body;

    if (!jobDescription || !resumeText) {
        return res.status(400).json({
            message: "Job description and Resume text are required fields."
        });
    }

    try {
        // 1. Generate the structured JSON data via the Gemini SDK
        const reportData = await generateInterviewReport(jobDescription, resumeText, selfDescription);

        // 2. Save directly to MongoDB (since keys match the Mongoose schema exactly)
        const savedReport = await InterviewReport.create({
            jobDescription,
            resumeText,
            selfDescription: selfDescription || "Not provided",
            technicalQuestion: reportData.technicalQuestion,
            behaviouralQuestion: reportData.behaviouralQuestion,
            preparationPlan: reportData.preparationPlan,
            skillGap: reportData.skillGap,
            weakness: reportData.weakness,
            strength: reportData.strength,
            score: reportData.score,
            overall: reportData.overall,
            userId: req.user.id
        });

        // 3. Return the saved document to the client
        res.status(201).json({
            message: "Interview report generated and saved successfully",
            report: savedReport
        });
    } catch (error) {
        console.error("❌ Error creating interview report:", error);
        res.status(500).json({
            message: "Failed to generate report",
            error: error.message || error
        });
    }
}

/**
 * @name getUserReportsController
 * @description Retrieves a list of all historical interview reports for the logged in user
 * @access Private
 */
async function getUserReportsController(req, res) {
    try {
        const userId = req.user.id;
        const reports = await InterviewReport.find({ userId })
            .select("jobDescription score overall createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User report history fetched successfully",
            reports
        });
    } catch (error) {
        console.error("❌ Error fetching user reports:", error);
        res.status(500).json({
            message: "Failed to fetch report history",
            error: error.message || error
        });
    }
}

/**
 * @name getSingleReportController
 * @description Retrieves full details of a specific report belonging to the user
 * @access Private
 */
async function getSingleReportController(req, res) {
    try {
        const userId = req.user.id;
        const reportId = req.params.id;

        const report = await InterviewReport.findOne({ _id: reportId, userId });
        if (!report) {
            return res.status(404).json({
                message: "Report not found or unauthorized access"
            });
        }

        res.status(200).json({
            message: "Report details fetched successfully",
            report
        });
    } catch (error) {
        console.error("❌ Error fetching single report:", error);
        res.status(500).json({
            message: "Failed to fetch report details",
            error: error.message || error
        });
    }
}

module.exports = { 
    createReportController,
    getUserReportsController,
    getSingleReportController
};
