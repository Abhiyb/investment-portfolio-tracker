<template>
    
    <div class="app-container">
    <!-- Import Navbar component -->
    <AppNavbar />
  
  <div class="content-wrapper">
    <!-- Import Sidebar component -->
    <AppSidebar />
        <!-- Main Content -->
        <main class="main-content">
          <div class="page-header">
            <h1>Transaction History</h1>
            <p class="subtitle">View all your past investment activities</p>
          </div>
  
          <div class="transaction-filters">
            <div class="search-container">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search transactions..." 
                class="search-input" 
                @input="filterTransactions"
              />
            </div>
            <div class="filter-controls">
              <div class="filter-dropdown">
                <button class="dropdown-button" @click="toggleTypeFilter">
                  {{ selectedType || 'All Types' }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                </button>
                <div class="dropdown-menu" v-if="showTypeFilter">
                  <div class="dropdown-item" @click="setTypeFilter('')">All Types</div>
                  <div class="dropdown-item" @click="setTypeFilter('BUY')">BUY</div>
                  <div class="dropdown-item" @click="setTypeFilter('SELL')">SELL</div>
                </div>
              </div>
              <div class="filter-dropdown">
                <button class="dropdown-button" @click="toggleSortOrder">
                  {{ sortOrder === 'desc' ? 'Newest First' : 'Oldest First' }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                </button>
                <div class="dropdown-menu" v-if="showSortFilter">
                  <div class="dropdown-item" @click="setSortOrder('desc')">Newest First</div>
                  <div class="dropdown-item" @click="setSortOrder('asc')">Oldest First</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Loading state -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading transactions...</p>
          </div>
  
          <!-- Error state -->
          <div v-else-if="error" class="error-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>{{ error }}</p>
            <button @click="fetchTransactions" class="retry-button">Try Again</button>
          </div>
  
          <!-- Empty state -->
          <div v-else-if="filteredTransactions.length === 0" class="empty-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path><path d="M15.5 2H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5.5"></path><path d="M8 19h1"></path><path d="M2 11h20"></path></svg>
            <p>No transactions found</p>
          </div>
  
          <!-- Transaction table -->
          <div v-else class="transaction-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction Type</th>
                  <th>Investment</th>
                  <th>Units</th>
                  <th>NAV at Transaction</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="transaction-row">
                  <td class="date-column">
                    <div class="date">{{ formatDate(transaction.txnDate) }}</div>
                    <div class="time">{{ formatTime(transaction.txnDate) }}</div>
                  </td>
                  <td>
                    <span class="transaction-badge" :class="transaction.txnType.toLowerCase()">
                      {{ transaction.txnType }}
                    </span>
                  </td>
                  <td class="investment-column">
                    <div class="investment-name">{{ transaction.investmentProductName }}</div>
                  </td>
                  <td>{{ formatNumber(transaction.units) }}</td>
                  <td>&#8377;{{ formatNumber(transaction.navAtTxn) }}</td>
                  <td>&#8377;{{ formatNumber(transaction.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
  </div>
    </div>
     
  </template>
  
  <script>
import AppNavbar from '../components/Navbar.vue'
import AppSidebar from '../components/Sidebar.vue'
  
  export default {
    name: 'TransactionHistory',
    components: {
      AppNavbar,
      AppSidebar
    },
    data() {
      return {
        transactions: [],
        filteredTransactions: [],
        loading: true,
        error: null,
        searchQuery: '',
        selectedType: '',
        sortOrder: 'desc',
        showTypeFilter: false,
        showSortFilter: false
      }
    },
    created() {
      this.fetchTransactions()
    },
    methods: {
        async fetchTransactions() {
  this.loading = true
  this.error = null

  try {
    const token = localStorage.getItem('token') // assuming you store it here after login

    const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/portfolio/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`)
    }

    const data = await response.json()
    this.transactions = data.transactions
    this.applyFilters()
    this.loading = false
  } catch (error) {
    console.error('Error fetching transactions:', error)
    this.error = 'Failed to load transactions. Please try again.'
    this.loading = false
  }
},
      
      formatDate(dateTimeString) {
        if (!dateTimeString) return ''
        const date = new Date(dateTimeString)
        return date.toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      },
      
      formatTime(dateTimeString) {
        if (!dateTimeString) return ''
        const date = new Date(dateTimeString)
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      },
      
      formatNumber(value) {
        if (value === null || value === undefined) return ''
        return Number(value).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      },
      
      filterTransactions() {
        this.applyFilters()
      },
      
      applyFilters() {
        let filtered = [...this.transactions]
        
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filtered = filtered.filter(txn => 
            txn.investmentProductName.toLowerCase().includes(query) ||
            txn.txnType.toLowerCase().includes(query)
          )
        }
        
        // Apply type filter
        if (this.selectedType) {
          filtered = filtered.filter(txn => txn.txnType === this.selectedType)
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          const dateA = new Date(a.txnDate)
          const dateB = new Date(b.txnDate)
          return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB
        })
        
        this.filteredTransactions = filtered
      },
      
      toggleTypeFilter() {
        this.showTypeFilter = !this.showTypeFilter
        this.showSortFilter = false
      },
      
      toggleSortOrder() {
        this.showSortFilter = !this.showSortFilter
        this.showTypeFilter = false
      },
      
      setTypeFilter(type) {
        this.selectedType = type
        this.showTypeFilter = false
        this.applyFilters()
      },
      
      setSortOrder(order) {
        this.sortOrder = order
        this.showSortFilter = false
        this.applyFilters()
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
  
  /* Main Content Styles */
  .main-content {
    flex: 1;
    padding: 30px;
    background-color: #ffffff;
  }
  
  .page-header {
    margin-bottom: 20px;
  }
  
  .page-header h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 5px;
  }
  
  .subtitle {
    color: #6b7280;
    font-size: 14px;
  }
  
  /* Transaction Filters */
  .transaction-filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .search-container {
    flex: 1;
    max-width: 800px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .filter-controls {
    display: flex;
    gap: 10px;
  }
  
  .filter-dropdown {
    position: relative;
  }
  
  .dropdown-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 150px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 10;
    margin-top: 5px;
  }
  
  .dropdown-item {
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: #f3f4f6;
  }
  
  /* Transaction Table */
  .transaction-table {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background-color: #f9fafb;
  }
  
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
  }
  
  td {
    padding: 16px;
    font-size: 14px;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .transaction-row {
    transition: background-color 0.2s;
  }
  
  .transaction-row:hover {
    background-color: #f9fafb;
  }
  
  .date-column {
    width: 150px;
  }
  
  .date {
    font-weight: 500;
  }
  
  .time {
    color: #6b7280;
    font-size: 13px;
    margin-top: 2px;
  }
  
  .transaction-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .transaction-badge.buy {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .transaction-badge.sell {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .investment-column {
    min-width: 200px;
  }
  
  .investment-name {
    font-weight: 500;
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
  @media (max-width: 768px) {
    .transaction-filters {
      flex-direction: column;
      gap: 10px;
    }
    
    .filter-controls {
      width: 100%;
    }
    
    .filter-dropdown {
      flex: 1;
    }
    
    .dropdown-button {
      width: 100%;
      justify-content: space-between;
    }
    
    .transaction-table {
      overflow-x: auto;
    }
    
    table {
      min-width: 700px;
    }
  }
  </style>