// utils/formatters.js

/**
 * Format investment type from API format to display format
 * @param {string} type - Investment type (e.g., 'MUTUAL_FUND')
 * @returns {string} Formatted type (e.g., 'Mutual Fund')
 */
export const formatType = (type) => {
    if (!type) return "";
    return type
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Format risk level for display
 * @param {string} riskLevel - Risk level (e.g., 'HIGH')
 * @returns {string} Formatted risk level (e.g., 'High')
 */
export const formatRiskLevel = (riskLevel) => {
    if (!riskLevel) return "";
    return riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1).toLowerCase();
};

/**
 * Get CSS class for risk badge based on risk level
 * @param {string} riskLevel - Risk level
 * @returns {string} CSS class name
 */
export const getRiskClass = (riskLevel) => {
    if (!riskLevel) return "risk-medium";
    switch (riskLevel.toUpperCase()) {
        case "LOW":
            return "risk-low";
        case "HIGH":
            return "risk-high";
        default:
            return "risk-medium";
    }
};

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = "$") => {
    if (value === null || value === undefined) return "";
    return `${currency}${Number(value).toLocaleString()}`;
};

/**
 * Format percentage value
 * @param {number} value - Numeric value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
    if (value === null || value === undefined) return "";
    return `${Number(value)}%`;
};