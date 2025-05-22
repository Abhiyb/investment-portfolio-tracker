<template>
    <div class="app-container">
    <!-- Import Navbar component -->
    <AppNavbar />
  
  <div class="content-wrapper">
    <!-- Import Sidebar component -->
    <AppSidebar />
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
      </div>
    </div>
  
</template>
<script>

import PortfolioHoldings from '../components/PortfolioHoldings.vue'
import PortfolioSummary from '../components/PortfolioSummary.vue'
import PortfolioAllocation from '../components/PortfolioAllocation.vue'
import AppNavbar from '../components/Navbar.vue'
import AppSidebar from '../components/Sidebar.vue'
export default {
    name: 'MyPortfolio',
  components: {
    
    AppSidebar,
    AppNavbar,
    PortfolioHoldings,
    PortfolioSummary,
    PortfolioAllocation
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
  </style>