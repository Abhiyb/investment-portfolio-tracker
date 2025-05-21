<template>
   
    <div class="main-content">
      <PortfolioHoldings />
    </div>
  
</template>
<script>

import PortfolioHoldings from '../components/PortfolioHoldings.vue'


export default {
    name: 'MyPortfolio',
  components: {
    
    PortfolioHoldings
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