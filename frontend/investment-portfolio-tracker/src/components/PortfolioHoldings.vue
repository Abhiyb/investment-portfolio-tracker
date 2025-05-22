<template>
    <div class="portfolio-holdings">
      <h2 class="portfolio-title">Portfolio Holdings</h2>
      
      
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading portfolio data...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>{{ error }}</p>
        <button @click="fetchPortfolioData" class="retry-button">Try Again</button>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="portfolioData.holdings.length === 0" class="empty-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <p>No holdings in your portfolio</p>
        <button @click="goToInvestments" class="action-btn primary-btn">Browse Investments</button>
      </div>
      
      <!-- Holdings table -->
      <div v-else class="table-responsive">
        <!-- Table info -->
        <div v-if="totalHoldings > itemsPerPage" class="table-info">
          <span>Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, totalHoldings) }} of {{ totalHoldings }} holdings</span>
        </div>
        
        <table class="holdings-table">
          <thead>
            <tr>
              <th>Investment</th>
              <th>Type</th>
              <th>Units</th>
              <th>Avg. Cost</th>
              <th>Current Value</th>
              <th>Profit/Loss</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="holding in paginatedHoldings" :key="holding.id" class="holding-row">
              <td class="investment-name">{{ holding.investmentProductName }}</td>
              <td>
                <span class="investment-type" :class="holding.type.toLowerCase().replace('_', '-')">
                  {{ formatType(holding.type) }}
                </span>
              </td>
              <td>{{ formatNumber(holding.unitsOwned) }}</td>
              <td>&#8377;{{ formatNumber(holding.avgPurchasePrice) }}</td>
              <td>&#8377;{{ formatNumber(holding.currentValue) }}</td>
              <td class="profit-cell">
                <div class="profit" :class="{ 'profit-positive': holding.percentageReturn > 0, 'profit-negative': holding.percentageReturn < 0 }">
                  <span class="profit-arrow">
                    <svg v-if="holding.percentageReturn > 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    <svg v-else-if="holding.percentageReturn < 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                  <span>&#8377;{{ formatNumber(holding.absoluteReturn) }} ({{ holding.percentageReturn }}%)</span>
                </div>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="action-btn sell-btn" @click="sellHolding(holding)" :disabled="holding.unitsOwned <= 0">Sell</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div v-if="totalHoldings > itemsPerPage" class="pagination-container">
          <div class="pagination">
            <!-- Previous button -->
            <button 
              class="pagination-btn" 
              :class="{ disabled: currentPage === 1 }"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            
            <!-- Page numbers -->
            <div class="page-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <!-- Next button -->
            <button 
              class="pagination-btn" 
              :class="{ disabled: currentPage === totalPages }"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          
          <!-- Items per page selector -->
          <div class="items-per-page">
            <label for="itemsPerPage">Items per page:</label>
            <select id="itemsPerPage" v-model="itemsPerPage" @change="resetToFirstPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PortfolioHoldings',
    data() {
      return {
        portfolioData: {
          holdings: [],
          totalInvestedValue: 0,
          totalCurrentValue: 0
        },
        loading: true,
        error: null
      }
    },
    created() {
      this.fetchPortfolioData()
    },
    methods: {
      async fetchPortfolioData() {
        this.loading = true
        this.error = null
        
        try {
          
          const token = localStorage.getItem('token')  // or wherever your token is stored

const response = await fetch('http://localhost:8080/portfolio', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
          if (!response.ok) {
            throw new Error(`Error fetching portfolio data: ${response.statusText}`)
          }
          
          const data = await response.json()
          this.portfolioData = data
          this.loading = false
        } catch (error) {
          console.error('Error fetching portfolio data:', error)
          this.error = 'Failed to load portfolio data. Please try again.'
          this.loading = false
        }
      },
      
      formatNumber(value) {
        if (value === null || value === undefined) return '0.00'
        return Number(value).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      },
      
      formatType(type) {
        // Convert SNAKE_CASE to Title Case
        return type.split('_').map(word => 
          word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ')
      },
      
      getTotalReturn() {
        return this.portfolioData.totalCurrentValue - this.portfolioData.totalInvestedValue
      },
      
      getTotalReturnPercentage() {
        if (this.portfolioData.totalInvestedValue === 0) return 0
        const percentage = (this.getTotalReturn() / this.portfolioData.totalInvestedValue) * 100
        return percentage.toFixed(2)
      },
      
      getTotalReturnClass() {
        const totalReturn = this.getTotalReturn()
        if (totalReturn > 0) return 'profit-positive'
        if (totalReturn < 0) return 'profit-negative'
        return ''
      },
      
      buyHolding(holding) {
        console.log(`Buying more of ${holding.investmentProductName}`)
        // In a real app, you would navigate to a buy page or open a modal
        // this.$router.push(`/investments/${holding.investmentProductId}/buy`)
      },
      
      sellHolding(holding) {
      if (holding.unitsOwned <= 0) return;
      console.log(`Selling ${holding.investmentProductName}`);
      
      // In a real app with Vue Router, you would use:
      this.$router.push(`/sell-investment/${holding.id}`);
      
      
    },
      
      goToInvestments() {
        console.log('Navigating to investments page')
        // In a real app with Vue Router, you would use:
        // this.$router.push('/investments')
      }
    }
  }
  </script>
  
  <style>
  .portfolio-holdings {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #1f2937;
    margin-bottom: 2rem;
  
  }
   
  
  .portfolio-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: #374151;
  }
  
  .portfolio-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .summary-card {
    flex: 1;
    min-width: 200px;
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
  
  .summary-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .summary-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .table-responsive {
    overflow-x: auto;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
  
  .holdings-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  
  .holdings-table th {
    text-align: left;
    padding: 0.875rem 1rem;
    font-weight: 500;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .holdings-table td {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s ease;
  }
  
  .holding-row {
    transition: all 0.2s ease;
  }
  
  .holding-row:hover {
    background-color: #f3f4f6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
  
  .holding-row:last-child td {
    border-bottom: none;
  }
  
  .investment-name {
    font-weight: 500;
  }
  
  .investment-type {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    background-color: #f3f4f6;
    color: #4b5563;
  }
  
  .investment-type.cryptocurrency {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .investment-type.mutual-fund {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .investment-type.etf {
    background-color: #f0fdf4;
    color: #166534;
  }
  
  .investment-type.bond {
    background-color: #f5f3ff;
    color: #5b21b6;
  }
  
  .investment-type.stock {
    background-color: #ede9fe;
    color: #6d28d9;
  }
  
  .profit-cell {
    font-weight: 500;
  }
  
  .profit {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .profit-positive {
    color: #10b981;
  }
  
  .profit-negative {
    color: #ef4444;
  }
  
  .profit-arrow {
    display: flex;
    align-items: center;
  }
  
  .actions-cell {
    white-space: nowrap;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  
  .buy-btn {
    background-color: #f9fafb;
    color: #1f2937;
    border-color: #e5e7eb;
  }
  
  .buy-btn:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
  
  .sell-btn {
    background-color: #f9fafb;
    color: #1f2937;
    border-color: #e5e7eb;
  }
  
  .sell-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
  
  .sell-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .primary-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
  }
  
  .primary-btn:hover {
    background-color: #2563eb;
  }
  
  /* Loading, Error, and Empty States */
  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    text-align: center;
    color: #6b7280;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    margin-top: 1rem;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .error-container svg,
  .empty-container svg {
    margin-bottom: 16px;
    color: #9ca3af;
  }
  
  .retry-button {
    margin-top: 16px;
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .retry-button:hover {
    background-color: #2563eb;
  }
  
  /* Responsive styles */
  @media (max-width: 1024px) {
    .holdings-table {
      font-size: 0.8125rem;
    }
    
    .holdings-table th,
    .holdings-table td {
      padding: 0.75rem;
    }
    
    .action-btn {
      padding: 0.375rem 0.75rem;
    }
  }
  
  @media (max-width: 768px) {
    .portfolio-summary {
      flex-direction: column;
    }
    
    .summary-card {
      width: 100%;
    }
    
    .holdings-table {
      min-width: 700px;
    }
  }
  
  @media (max-width: 640px) {
    .portfolio-title {
      font-size: 1.25rem;
    }
  }
  </style>