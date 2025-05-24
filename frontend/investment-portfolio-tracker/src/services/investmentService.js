// services/investmentService.js
// Base API URL - you should replace this with your actual backend URL
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

/**
 * Service for investment related API calls
 */
export const investmentService = {
    /**
     * Get all investments
     * @returns {Promise} Array of investments
     */
    getInvestments: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/admin/investments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch investments');
            }

            return data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all investments
     * @returns {Promise} Array of investments
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
     * Get all investments
     * @returns {Promise} Array of investments
     */
    getRiskTypes: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/riskTypes`, {
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

            console.log('Investment Type:', type);

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

            console.log('Risk Level:', riskLevel);

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

            // Decide whether to use combined filter endpoint or individual filtering
            // For this implementation, we'll use a POST endpoint for combined filtering
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
    },


    /**
     * Add a new investment
     * @param {Object} investmentData - Investment data to add
     * @returns {Promise} Created investment
     */
    addInvestment: async (investmentData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/admin/investments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investmentData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to add investment');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update an existing investment
     * @param {string} id - Investment ID
     * @param {Object} investmentData - Updated investment data
     * @returns {Promise} Updated investment
     */
    updateInvestment: async (id, investmentData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/admin/investments/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investmentData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to update investment');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete an investment
     * @param {string} id - Investment ID to delete
     * @returns {Promise} Result of the delete operation
     */
    deleteInvestment: async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/admin/investments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to delete investment');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

export default investmentService;