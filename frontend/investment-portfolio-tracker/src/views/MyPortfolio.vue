<template>
   
    <div class="main-content">
        
        <div class="row">
          <div class="col">
            <PortfolioSummary />
          </div>
          <div class="col">
            <PortfolioAllocation />
          </div>

        </div>
        
            <PortfolioHoldings />
         

    </div>
  
</template>
<script>

import PortfolioHoldings from '../components/PortfolioHoldings.vue'
import PortfolioSummary from '../components/PortfolioSummary.vue'
import PortfolioAllocation from '../components/PortfolioAllocation.vue'

export default {
    name: 'MyPortfolio',
  components: {
    
    PortfolioHoldings,
    PortfolioSummary,
    PortfolioAllocation
  }
  
}
</script>
<style scoped>

  
  /* Main Content Styles */
  .main-content {
    flex: 1;
    padding: 30px;
    background-color: #ffffff;
  }
  </style>