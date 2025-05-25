<template>
  <div class="investment-user">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-top">
          <div class="header-text">
            <div class="title-section">
              <h1>Investment Opportunities</h1>
              <div class="investment-count" v-if="investments.length">
                <span class="count-number">{{ investments.length }}</span>
                <span class="count-label">Investments Available</span>
              </div>
            </div>
            <p class="subtitle">
              Discover and invest in carefully curated financial instruments to
              grow your portfolio.
            </p>
          </div>
          <button
            class="filter-toggle-btn"
            @click="toggleFilters"
            :class="{ active: showFilters }"
          >
            <svg
              class="filter-icon"
              :class="{ rotated: showFilters }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Filters
            <svg
              class="chevron-icon"
              :class="{ rotated: showFilters }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Collapsible Search and Filter Panel -->
    <div class="filter-panel-container">
      <Transition name="slide-fade">
        <SearchFilterPanel
          v-show="showFilters"
          :filters="filters"
          :investment-types="investmentTypes"
          search-placeholder="Search by product name..."
          @filter-change="handleFilterChange"
          @apply-filters="applyFilters"
          @clear-filters="clearFilters"
        />
      </Transition>
    </div>

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
import { onMounted, ref } from "vue";
import SearchFilterPanel from "./SearchFilterPanel.vue";
import InvestmentGrid from "./InvestmentGrid.vue";
import { useFilters } from "../../composables/useFilters";
import { useInvestmentData } from "../../composables/useInvestmentData";
import investmentUserService from "../../services/investmentUserService";
import { useRouter } from "vue-router";

export default {
  name: "InvestmentUser",
  components: {
    SearchFilterPanel,
    InvestmentGrid,
  },
  setup() {
    const router = useRouter();
    const { filters, clearFilters: resetFilters } = useFilters();
    const {
      investments,
      investmentTypes,
      isLoading: isLoadingList,
      filterInvestments,
      initialize,
    } = useInvestmentData(investmentUserService);

    // Filter panel visibility state
    const showFilters = ref(false);

    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

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
      showFilters,
      toggleFilters,
      handleFilterChange,
      applyFilters,
      clearFilters,
      handleInvestNow,
    };
  },
};
</script>

<style scoped>
.investment-user {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.025em;
}

.investment-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #1e398a 0%, #1d4ed8 100%);
  border-radius: 2rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.count-number {
  font-size: 1.125rem;
  font-weight: 700;
}

.count-label {
  font-weight: 500;
  opacity: 0.9;
}

.subtitle {
  color: #64748b;
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 400;
  margin: 0;
  max-width: 600px;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}

.filter-toggle-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filter-toggle-btn.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.15);
}

.filter-icon {
  width: 1.125rem;
  height: 1.125rem;
  transition: transform 0.2s ease;
}

.filter-icon.rotated {
  transform: rotate(180deg);
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.filter-panel-container {
  margin-bottom: 2rem;
}

/* Smooth transition animations */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .header-top {
    gap: 1.5rem;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-content h1 {
    font-size: 1.875rem;
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  .filter-toggle-btn {
    justify-content: center;
    width: 100%;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .investment-count {
    align-self: flex-start;
  }

  .page-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .title-section {
    gap: 0.5rem;
  }

  .investment-count {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .count-number {
    font-size: 1rem;
  }
}
</style>