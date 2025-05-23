<template>
  <div class="app-container">
  <!-- Import Navbar component -->
  <AppNavbar />

<div class="content-wrapper">
  <!-- Import Sidebar component -->
  <AppSidebar />
  <div class="main-content">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading investment details...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchInvestmentData" class="retry-button">Retry</button>
    </div>

    <!-- Main content -->
    <div v-else>
      <!-- Back navigation -->
      <div class="back-link">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Investments
        </button>
      </div>
  
      <!-- Investment header -->
      <h1 class="investment-title">{{ investment.name }}</h1>
      <div class="investment-tags">
        <span class="tag fund-type">{{ investment.type }}</span>
        <span class="tag risk-level">{{ getRiskLevelDisplay(investment.riskLevel) }}</span>
      </div>
  
      <!-- Main content layout -->
      <div class="content-layout">
        <!-- Left column - Investment details -->
        <div class="details-panel">
          <div class="section">
            <h2 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              Investment Overview
            </h2>
            
            <div class="overview-cards">
              <div class="overview-card">
                <div class="card-label">Current NAV</div>
                <div class="card-value">${{ formatCurrency(investment.currentNetAssetValuePerUnit) }}</div>
              </div>
              
              <div class="overview-card">
                <div class="card-label">Expected Annual Return</div>
                <div class="card-value return-value">{{ investment.expectedAnnualReturnRate }}%</div>
              </div>
              
              <div class="overview-card">
                <div class="card-label">Minimum Investment</div>
                <div class="card-value">${{ formatCurrency(investment.minimumInvestment) }}</div>
              </div>
            </div>
          </div>
  
          <div class="section">
            <h2 class="section-title">Investment Description</h2>
            <p class="description-text">{{ investment.description }}</p>
          </div>
  
          <div class="section">
            <h2 class="section-title warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Risk Factors
            </h2>
            <ul class="risk-list">
              <li v-for="(risk, index) in getRiskFactors(investment.riskLevel)" :key="index">
                {{ risk }}
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Right column - Buy panel -->
        <div class="buy-panel">
          <h2 class="buy-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Buy Investment
          </h2>
          <p class="buy-subtitle">Simulate purchasing this investment</p>
  
          <div class="form-group">
            <label for="units" class="form-label">Number of Units</label>
            <input 
              type="number" 
              id="units" 
              v-model="units" 
              placeholder="Enter number of units" 
              class="form-input"
              min="0"
              step="1"
              @input="calculateTotal"
              :disabled="buyLoading"
            >
          </div>
  
          <div class="form-group">
            <label class="form-label">Price per Unit</label>
            <div class="form-value">${{ formatCurrency(investment.currentNetAssetValuePerUnit) }}</div>
          </div>
  
          <div class="form-group">
            <label class="form-label">Total Cost</label>
            <div class="form-value">${{ formatCurrency(totalCost) }}</div>
          </div>

          <div v-if="validationError" class="validation-error">
            {{ validationError }}
          </div>
  
          <button 
            @click="buyInvestment" 
            class="buy-button"
            :disabled="!canBuy || buyLoading"
            :class="{ 'button-disabled': !canBuy || buyLoading }"
          >
            <span v-if="buyLoading">Processing...</span>
            <span v-else>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div></div>
</template>

<script>
import AppNavbar from '../components/Navbar.vue'
import AppSidebar from '../components/Sidebar.vue'
import { useRoute } from 'vue-router'


export default {
  name: 'BuyInvestment',
  
  components: {
    AppNavbar,
    AppSidebar,
  },
  data() {
    return {
      investment: {},
      units: '',
      totalCost: 0,
      loading: false,
      buyLoading: false,
      error: null,
      validationError: null,
      
      
      investmentId: this.$route.params.id,
    }
  },
  computed: {
    canBuy() {
      if (!this.units || isNaN(this.units) || this.units <= 0) {
        return false;
      }
      const minInvestment = parseFloat(this.investment.minimumInvestment || 0);
      return this.totalCost >= minInvestment;
    },
    
  },
  mounted() {
    const investmentId = this.$route.params.id
    
    this.fetchInvestmentData();
  },
 
  methods: {
    async fetchInvestmentData() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token');
        
        const numericId = parseInt(this.investmentId);
        const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_URL +`/investments/${numericId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch investment data: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 200 && result.data) {
          this.investment = result.data;
        } else {
          throw new Error(result.message || 'Failed to load investment data');
        }
      } catch (err) {
        console.error('Error fetching investment data:', err);
        this.error = 'Failed to load investment details. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    calculateTotal() {
      this.validationError = null;
      
      if (this.units && !isNaN(this.units) && this.units > 0) {
        const nav = parseFloat(this.investment.currentNetAssetValuePerUnit || 0);
        this.totalCost = parseFloat(this.units) * nav;
        
        // Validate minimum investment
        const minInvestment = parseFloat(this.investment.minimumInvestment || 0);
        if (this.totalCost < minInvestment) {
          this.validationError = `Minimum investment required: $${this.formatCurrency(minInvestment)}`;
        }
      } else {
        this.totalCost = 0;
      }
    },

    async buyInvestment() {
      if (!this.canBuy) return;
      
      this.buyLoading = true;
      this.validationError = null;
      
      try {
        const requestBody = {
          investmentProductId: parseInt(this.investmentId),
          units: parseInt(this.units)
        };
        const token = localStorage.getItem('token');
        console.log('Request Body:', requestBody);
        
        const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_URL + `/portfolio/buy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert(`Successfully purchased ${this.units} units of ${this.investment.name} for $${this.formatCurrency(this.totalCost)}`);
          // Reset form
          this.units = '';
          this.totalCost = 0;
        } else {
          throw new Error(result.message || 'Failed to purchase investment');
        }
      } catch (err) {
        console.error('Error buying investment:', err);
        this.validationError = 'Failed to purchase investment. Please try again.';
      } finally {
        this.buyLoading = false;
      }
    },

    goBack() {
      // Check if Vue Router is available
      if (this.$router) {
        this.$router.push('/investments');
      } else if (this.$route && this.$route.path) {
        // Try using browser's back button if router is available but push fails
        window.history.back();
      } else {
        // Fallback to manual navigation
        window.location.href = '/investments';
      }
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00';
      return parseFloat(amount).toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    },

    getRiskLevelDisplay(riskLevel) {
      const riskMap = {
        'LOW': 'LOW RISK',
        'MEDIUM': 'MEDIUM RISK', 
        'HIGH': 'HIGH RISK'
      };
      return riskMap[riskLevel] || riskLevel;
    },

    getRiskFactors(riskLevel) {
      const baseFactors = [
        'Past performance does not guarantee future results.',
        'The value of investments can go down as well as up.'
      ];
      
      const riskSpecificFactors = {
        'LOW': [
          'This investment has low volatility with stable returns.',
          'Suitable for conservative investors with short to medium-term investment horizon.'
        ],
        'MEDIUM': [
          'This investment has moderate volatility with balanced risk and return potential.',
          'Suitable for investors with a medium-term investment horizon.'
        ],
        'HIGH': [
          'This investment has high volatility with potential for significant gains or losses.',
          'Suitable for aggressive investors with a long-term investment horizon.'
        ]
      };
      
      return [...baseFactors, ...(riskSpecificFactors[riskLevel] || riskSpecificFactors['MEDIUM'])];
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
 /* Content Layout */
 .content-wrapper {
  display: flex;
  flex: 1;
}
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.error-message {
  color: #dc2626;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.retry-button:hover {
  background-color: #2563eb;
}

.validation-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
}

.back-link {
  margin-bottom: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1f2937;
}

.investment-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
}

.investment-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tag {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.fund-type {
  background-color: #1e3a8a;
  color: white;
}

.risk-level {
  background-color: #fef3c7;
  color: #92400e;
}

.content-layout {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.details-panel {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.buy-panel {
  width: 350px;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.section {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1.25rem 0;
  color: #1f2937;
}

.overview-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.overview-card {
  flex: 1;
  min-width: 200px;
  background-color: #f9fafb;
  padding: 1.25rem;
  border-radius: 0.375rem;
}

.card-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.return-value {
  color: #059669;
}

.description-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #6b7280;
}

.warning {
  color: #f59e0b;
}

.risk-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #6b7280;
}

.risk-list li {
  margin-bottom: 0.75rem;
}

.risk-list li:last-child {
  margin-bottom: 0;
}

.buy-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.buy-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-value {
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.buy-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.buy-button:hover:not(.button-disabled) {
  background-color: #2563eb;
}

.button-disabled {
  background-color: #6b7280;
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
  }
  
  .buy-panel {
    width: 100%;
  }
  
  .overview-card {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .investment-title {
    font-size: 1.5rem;
  }
  
  .investment-tags {
    flex-wrap: wrap;
  }
  
  .section {
    padding: 1.25rem;
  }
  
  .card-value {
    font-size: 1.25rem;
  }
}
</style>