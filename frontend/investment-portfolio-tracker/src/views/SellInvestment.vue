<template>
  <div class="app-container">
    <!-- Import Navbar component -->
    <AppNavbar />
  
  <div class="content-wrapper">
    <!-- Import Sidebar component -->
    <AppSidebar />
    <div class="sell-investment">
      <!-- Back navigation -->
      <div class="back-link">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Portfolio
        </button>
      </div>
  
      <!-- Investment header -->
      <h1 class="investment-title">Sell {{ investment.investmentProductName }}</h1>
      <div class="investment-tags">
        <span class="tag fund-type" :class="investment.type.toLowerCase().replace('_', '-')">
          {{ formatType(investment.type) }}
        </span>
        <span class="tag risk-level" :class="getRiskLevelClass(investment.riskLevel)">
          {{ investment.riskLevel }}
        </span>
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
                <div class="card-value">&#8377;{{ formatNumber(investment.currentNAV) }}</div>
              </div>
              
              <div class="overview-card">
                <div class="card-label">Units Owned</div>
                <div class="card-value">{{ formatNumber(investment.unitsOwned) }}</div>
              </div>
              
              <div class="overview-card">
                <div class="card-label">Current Value</div>
                <div class="card-value">&#8377;{{ formatNumber(investment.currentValue) }}</div>
              </div>
            </div>
          </div>
  
          <div class="section">
            <h2 class="section-title">Performance</h2>
            <div class="performance-metrics">
              <div class="metric">
                <span class="metric-label">Average Purchase Price:</span>
                <span class="metric-value">&#8377;{{ formatNumber(investment.avgPurchasePrice) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Invested Value:</span>
                <span class="metric-value">&#8377;{{ formatNumber(investment.investedValue) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Profit/Loss:</span>
                <span class="metric-value" :class="getReturnClass(investment.percentageReturn)">
                  &#8377;{{ formatNumber(investment.absoluteReturn) }} ({{ investment.percentageReturn }}%)
                </span>
              </div>
            </div>
          </div>
  
          <div class="section">
            <h2 class="section-title warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Important Information
            </h2>
            <ul class="risk-list">
              <li>Selling investments may result in capital gains or losses.</li>
              <li>Market prices may fluctuate between the time you place your order and when it executes.</li>
              <li>Sell orders are typically processed within 1-2 business days.</li>
              <li>Please review your order details carefully before confirming.</li>
            </ul>
          </div>
        </div>
  
        <!-- Right column - Sell panel -->
        <div class="sell-panel">
          <h2 class="sell-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Sell Investment
          </h2>
          <p class="sell-subtitle">Enter the number of units you wish to sell</p>
  
          <div class="form-group">
            <label for="units" class="form-label">Number of Units to Sell</label>
            <input 
              type="number" 
              id="units" 
              v-model="unitsToSell" 
              placeholder="Enter number of units" 
              class="form-input"
              min="0.01"
              :max="investment.unitsOwned"
              step="0.01"
              @input="calculateTotal"
            >
            <div class="form-hint">
              Maximum available: {{ formatNumber(investment.unitsOwned) }} units
            </div>
            <div v-if="unitsError" class="form-error">
              {{ unitsError }}
            </div>
          </div>
  
          <div class="form-group">
            <label class="form-label">Current Price per Unit</label>
            <div class="form-value">&#8377;{{ formatNumber(investment.currentNAV) }}</div>
          </div>
  
          <div class="form-group">
            <label class="form-label">Estimated Proceeds</label>
            <div class="form-value highlight">&#8377;{{ formatNumber(estimatedProceeds) }}</div>
          </div>
  
          <div class="form-group">
            <label class="form-label">Estimated Profit/Loss</label>
            <div class="form-value" :class="getReturnClass(estimatedProfitPercentage)">
                &#8377;{{ formatNumber(estimatedProfit) }} ({{ estimatedProfitPercentage.toFixed(2) }}%)
            </div>
          </div>
  
          <button 
            @click="sellInvestment" 
            class="sell-button"
            :disabled="!canSell || isSubmitting"
            :class="{ 'button-disabled': !canSell || isSubmitting }"
          >
            <span v-if="isSubmitting">
              <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Processing...
            </span>
            <span v-else>Confirm Sale</span>
          </button>
  
          <div v-if="apiError" class="api-error">
            {{ apiError }}
          </div>
        </div>
      </div>
    </div></div></div>
  </template>
  
  <script>
  export default {
    name: 'SellInvestment',
    props: {
      investmentId: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        investment: {
          id: null,
          investmentProductId: null,
          investmentProductName: '',
          type: 'MUTUAL_FUND',
          riskLevel: 'MEDIUM',
          unitsOwned: 0,
          avgPurchasePrice: 0,
          currentNAV: 0,
          investedValue: 0,
          currentValue: 0,
          absoluteReturn: 0,
          percentageReturn: 0
        },
        unitsToSell: '',
        estimatedProceeds: 0,
        estimatedProfit: 0,
        estimatedProfitPercentage: 0,
        unitsError: '',
        apiError: '',
        isSubmitting: false,
        isLoading: true
      }
    },
    computed: {
      canSell() {
        return this.unitsToSell > 0 && 
               this.unitsToSell <= this.investment.unitsOwned && 
               !this.unitsError;
      }
    },
    created() {
      // In a real app, you would fetch the investment details using the ID
      // For now, we'll simulate this with mock data
      this.fetchInvestmentDetails();
    },
    methods: {
        async fetchInvestmentDetails() {
      this.isLoading = true;
      
      // Debug logs
      console.log('Fetching investment details...');
      console.log('Investment ID from props:', this.investmentId);
      console.log('Type of investmentId:', typeof this.investmentId);
      
      // If the ID is coming from route params instead of props:
      const id = this.investmentId || this.$route?.params?.id;
      console.log('Final ID to use:', id);
      
      if (!id) {
        this.apiError = 'No investment ID provided';
        this.isLoading = false;
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const numericId = parseInt(id);
        console.log('Making API call with ID:', numericId);
        
        const response = await fetch(`http://localhost:8080/portfolio/${numericId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Error fetching investment details: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Investment details received:', data);
        
        if (data) {
          this.investment = data;
        } else {
          this.apiError = 'Investment not found in your portfolio.';
        }
      } catch (error) {
        console.error('Error fetching investment details:', error);
        this.apiError = 'Failed to load investment details. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
      
      calculateTotal() {
        // Clear previous errors
        this.unitsError = '';
        
        // Validate input
        if (!this.unitsToSell || isNaN(this.unitsToSell) || this.unitsToSell <= 0) {
          this.estimatedProceeds = 0;
          this.estimatedProfit = 0;
          this.estimatedProfitPercentage = 0;
          if (this.unitsToSell !== '') {
            this.unitsError = 'Please enter a valid number of units.';
          }
          return;
        }
        
        if (parseFloat(this.unitsToSell) > this.investment.unitsOwned) {
          this.unitsError = `You can only sell up to ${this.formatNumber(this.investment.unitsOwned)} units.`;
        }
        
        // Calculate proceeds
        const units = parseFloat(this.unitsToSell);
        this.estimatedProceeds = units * this.investment.currentNAV;
        
        // Calculate profit/loss
        const costBasis = units * this.investment.avgPurchasePrice;
        this.estimatedProfit = this.estimatedProceeds - costBasis;
        
        // Calculate percentage
        if (costBasis > 0) {
          this.estimatedProfitPercentage = (this.estimatedProfit / costBasis) * 100;
        } else {
          this.estimatedProfitPercentage = 0;
        }
      },
      
      async sellInvestment() {
  if (!this.canSell || this.isSubmitting) return;
  
  this.isSubmitting = true;
  this.apiError = '';
  
  try {
    // Get the token from localStorage (same as in fetchInvestmentDetails)
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    // Prepare the request payload
    const sellRequest = {
      investmentProductId: this.investment.investmentProductId,
      units: parseFloat(this.unitsToSell)
    };
    
    console.log('Sending sell request:', sellRequest);
    
    // Make the API call
    const response = await fetch('http://localhost:8080/portfolio/sell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sellRequest)
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Error selling investment: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If response is not JSON, use the default error message
      }
      throw new Error(errorMessage);
    }
    
    // Handle successful response
    const result = await response.json();
    console.log('Sale successful:', result);
    
    // Show success message
    alert(`Successfully sold ${this.formatNumber(this.unitsToSell)} units of ${this.investment.investmentProductName} for ₹${this.formatNumber(this.estimatedProceeds)}`);
    
    // Navigate back to portfolio
    this.goBack();
    
  } catch (error) {
    console.error('Error selling investment:', error);
    this.apiError = error.message || 'Failed to process your sell order. Please try again.';
  } finally {
    this.isSubmitting = false;
  }
},
      
      formatNumber(value) {
        if (value === null || value === undefined) return '0.00';
        return Number(value).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      },
      
      formatType(type) {
        // Convert SNAKE_CASE to Title Case
        return type.split('_').map(word => 
          word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
      },
      
      getReturnClass(percentage) {
        if (percentage > 0) return 'profit-positive';
        if (percentage < 0) return 'profit-negative';
        return '';
      },
      
      getRiskLevelClass(riskLevel) {
        switch (riskLevel) {
          case 'LOW': return 'risk-low';
          case 'MEDIUM': return 'risk-medium';
          case 'HIGH': return 'risk-high';
          default: return '';
        }
      },
      
      goBack() {
        // In a real app with Vue Router, you would use:
        // this.$router.push('/portfolio');
        console.log('Navigating back to portfolio');
        // For demo purposes, we'll just simulate going back
        window.history.back();
      }
    }
  }
  </script>
  
  <style>
  .sell-investment {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    color: #374151;
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
  
  .fund-type.cryptocurrency {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .fund-type.mutual-fund {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .fund-type.etf {
    background-color: #f0fdf4;
    color: #166534;
  }
  
  .fund-type.bond {
    background-color: #f5f3ff;
    color: #5b21b6;
  }
  
  .fund-type.stock {
    background-color: #ede9fe;
    color: #6d28d9;
  }
  
  .risk-low {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .risk-medium {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .risk-high {
    background-color: #fee2e2;
    color: #b91c1c;
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
  
  .sell-panel {
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
  
  .performance-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .metric-label {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .metric-value {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1f2937;
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
  
  .sell-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }
  
  .sell-subtitle {
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
  
  .form-hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  .form-error {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.5rem;
  }
  
  .form-value {
    padding: 0.75rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
  }
  
  .highlight {
    background-color: #f0f9ff;
    border-color: #bae6fd;
    color: #0369a1;
  }
  
  .profit-positive {
    color: #10b981;
  }
  
  .profit-negative {
    color: #ef4444;
  }
  
  .sell-button {
    width: 100%;
    padding: 0.875rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  
  .sell-button:hover:not(.button-disabled) {
    background-color: #dc2626;
  }
  
  .button-disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .api-error {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    color: #b91c1c;
    font-size: 0.875rem;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .content-layout {
      flex-direction: column;
    }
    
    .sell-panel {
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