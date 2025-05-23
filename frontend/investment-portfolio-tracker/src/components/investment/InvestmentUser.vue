<template>
  <div class="investment-user">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1>Investment Opportunities</h1>
        <p class="subtitle">
          Explore available financial instruments for your portfolio.
        </p>
      </div>
    </div>

    <!-- Search and Filter Panel -->
    <SearchFilterPanel
      :filters="filters"
      :investment-types="investmentTypes"
      search-placeholder="Search by product name..."
      @filter-change="handleFilterChange"
      @apply-filters="applyFilters"
      @clear-filters="clearFilters"
    />

    <!-- Investment Grid -->
    <InvestmentGrid
      :investments="investments"
      :is-loading="isLoadingList"
      loading-message="Loading investments..."
      empty-title="No investments found"
      empty-message="No investments found. Please adjust your filters or check back later."
      :show-footer-action="true"
      footer-action-text="Invest Now"
      @footer-action="handleInvestNow"
    />
  </div>
</template>

<script>
import { onMounted } from "vue";
import SearchFilterPanel from "./SearchFilterPanel.vue";
import InvestmentGrid from "./InvestmentGrid.vue";
import { useFilters } from "../../composables/useFilters";
import { useInvestmentData } from "../../composables/useInvestmentData";
import investmentUserService from "../../services/investmentUserService";

import { useRouter } from "vue-router"; // <-- add this

export default {
  name: "InvestmentUser",
  components: {
    SearchFilterPanel,
    InvestmentGrid,
  },
  setup() {
  const router = useRouter(); // Get the router instance
  const { filters, clearFilters: resetFilters } = useFilters();
  const {
    investments,
    investmentTypes,
    isLoading: isLoadingList,
    filterInvestments,
    initialize,
  } = useInvestmentData(investmentUserService);

  const handleFilterChange = (newFilters) => {
    Object.assign(filters, newFilters);
    applyFilters();
  };

  const applyFilters = async () => {
    const filterPayload = {
      type: filters.type || null,
      riskLevel: filters.riskLevel || null,
      searchTerm: filters.name || null,
    };

    await filterInvestments(filterPayload);
  };

  const clearFilters = () => {
    resetFilters();
    initialize();
  };

  const handleInvestNow = (investment) => {
    console.log("Invest in:", investment.name);
    router.push(`/buy-investment/${investment.id}`); 
  };

  onMounted(() => {
    initialize();
  });

  return {
    investments,
    investmentTypes,
    isLoadingList,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    handleInvestNow,
  };
}
};
</script>

<style scoped>
.investment-user {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content h1 {
  font-size: 1.75rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
}
</style>