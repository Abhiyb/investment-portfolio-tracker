<script setup>
import { ref, computed, onMounted } from 'vue';

const totalInvested = ref(0);
const currentValue = ref(0);
const absoluteReturn = ref(0);
const returnPercentage = ref(0);

const isProfitable = computed(() => absoluteReturn.value > 0);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(value);
};

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/portfolio/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);

    totalInvested.value = data.totalInvested;
    currentValue.value = data.currentValue;
    absoluteReturn.value = data.absoluteReturn;
    returnPercentage.value = data.returnPercentage;
  } catch (error) {
    console.error('Failed to fetch portfolio summary:', error);
  }
});

</script>

<template>
    <div class="portfolio-summary">
      <div class="summary-header">
        
        <div class="row">
          <h2>Portfolio Summary</h2>
          <p class="subtitle">Your investment overview</p>
        </div>
      </div>
      
      <div class="summary-content row">
        <div class="summary-item">
          <div class="label">Total Investment</div>
          <div class="value">{{ formatCurrency(totalInvested) }}</div>
        </div>
        
        <div class="summary-item">
          <div class="label">Current Value</div>
          <div class="value">{{ formatCurrency(currentValue) }}</div>
        </div>
        
        <div class="profit-section">
          <div class="profit-label">Profit / Loss</div>
          <div class="profit-content">
            <div class="profit-value" :class="{ 'profit-positive': isProfitable, 'profit-negative': !isProfitable }">
              <span class="arrow">{{ isProfitable ? '↑' : '↓' }}</span>
              {{ formatCurrency(Math.abs(absoluteReturn)) }}
            </div>
            <div class="profit-percentage" :class="{ 'profit-positive': isProfitable, 'profit-negative': !isProfitable }">
              {{ isProfitable ? '+' : '-' }}{{ returnPercentage.toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<style scoped>
.portfolio-summary {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.portfolio-summary:hover {
 
  transform: translateY(-2px);
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.icon {
  font-size: 24px;
  margin-right: 16px;
}

h2 {
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a202c;
}

.subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
}

.value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
}

.profit-section {
  grid-column: span 2;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.profit-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
}

.profit-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profit-value {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.arrow {
  margin-right: 4px;
}

.profit-percentage {
  font-size: 1rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 16px;
}

.profit-positive {
  color: #10b981;
}

.profit-negative {
  color: #ef4444;
}

@media (max-width: 768px) {
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .profit-section {
    grid-column: span 1;
  }
}
</style>