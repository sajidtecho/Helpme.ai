import axios from "axios";
import { API_BASE_URL } from "../../../config/api.js";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

/**
 * Sends candidate details to backend to generate structured AI analysis.
 * @param {string} jobDescription
 * @param {string} resumeText
 * @param {string} selfDescription
 * @returns {Promise<Object>} The API response container.
 */
export async function generateReport(jobDescription, resumeText, selfDescription) {
    try {
        const response = await api.post('/api/reports/generate', {
            jobDescription,
            resumeText,
            selfDescription
        });
        return response.data;
    } catch (error) {
        console.error("error during report generation request:", error);
        throw error;
    }
}

/**
 * Fetches all generated reports for the current user.
 */
export async function getUserReports() {
    try {
        const response = await api.get('/api/reports');
        return response.data;
    } catch (error) {
        console.error("error during report history request:", error);
        throw error;
    }
}

/**
 * Fetches detailed content of a single report.
 * @param {string} id
 */
export async function getReportDetails(id) {
    try {
        const response = await api.get(`/api/reports/${id}`);
        return response.data;
    } catch (error) {
        console.error("error during report detail request:", error);
        throw error;
    }
}
