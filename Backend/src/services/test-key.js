require("dotenv").config({ path: "../../.env" });
const generateInterviewReport = require("./ai.service");

console.log("🔑 Current API Key loaded:", process.env.GOOGLE_API_KEY ? "Present (starts with " + process.env.GOOGLE_API_KEY.slice(0, 6) + ")" : "MISSING");

generateInterviewReport("JD Test", "Resume Test", "Self Test")
    .then((res) => {
        console.log("🚀 SUCCESS! Response:", res);
    })
    .catch((err) => {
        console.error("❌ FAILURE! Details:");
        if (err.status) console.error("Status Code:", err.status);
        console.error(err);
    });
