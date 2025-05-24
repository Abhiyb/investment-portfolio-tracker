// services/investmentUserService.js
// Base API URL - you should replace this with your actual backend URL
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

/**
 * Service for user investment related API calls
 */
export const investmentUserService = {
    /**
     * Get all active investments for users
     * @returns {Promise} Array of active investments
     */
    getInvestments: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/investments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch investments');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all investment types
     * @returns {Promise} Array of investment types
     */
    getInvestmentTypes: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/investmentTypes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response); // Debug

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch investment types');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get investments by type
     * @param {string} type - Investment type (STOCK, MUTUAL_FUND, etc.)
     * @returns {Promise} Array of investments filtered by type
     */
    getInvestmentsByType: async (type) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/investments/type/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch investments by type');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get investments by risk level
     * @param {string} riskLevel - Risk level (LOW, MEDIUM, HIGH)
     * @returns {Promise} Array of investments filtered by risk level
     */
    getInvestmentsByRiskLevel: async (riskLevel) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/investments/risk/${riskLevel}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch investments by risk level');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Filter investments with combined criteria
     * @param {Object} filters - Object containing filter criteria
     * @returns {Promise} Array of filtered investments
     */
    filterInvestments: async (filters) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Use combined filter endpoint for filtering
            const response = await fetch(`${API_URL}/investments/filter`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filters)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to filter investments');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            throw error;
        }
    }
};

export default investmentUserService;