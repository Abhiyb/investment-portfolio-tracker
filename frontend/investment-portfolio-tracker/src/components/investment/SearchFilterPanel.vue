<template>
  <div class="search-filter-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3 class="panel-title">Find Your Perfect Investment</h3>
        <p class="panel-subtitle">
          Filter and search through our curated investment opportunities
        </p>
      </div>
      <div class="active-filters" v-if="hasActiveFilters">
        <span class="active-count"
          >{{ activeFilterCount }} active filter{{
            activeFilterCount > 1 ? "s" : ""
          }}</span
        >
      </div>
    </div>

    <div class="search-section">
      <div class="search-box">
        <div class="search-input-wrapper">
          <span class="search-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
          <input
            type="text"
            v-model="localFilters.name"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleFilterChange"
            @keydown.enter="handleApplyFilters"
          />
          <button
            v-if="localFilters.name"
            @click="clearSearchTerm"
            class="clear-search-btn"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button class="search-btn" @click="handleApplyFilters">
          <span class="btn-text">Search</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-header">
        <h4>Refine Results</h4>
        <button
          @click="handleClearFilters"
          class="clear-all-btn"
          v-if="hasActiveFilters"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3,6 5,6 21,6"></polyline>
            <path
              d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6"
            ></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Clear All
        </button>
      </div>

      <div class="filter-controls">
        <div v-if="showTypeFilter" class="filter-group">
          <label class="filter-label">Investment Type</label>
          <div class="filter-dropdown">
            <select
              v-model="localFilters.type"
              @change="handleFilterChange"
              class="filter-select"
            >
              <option value="">All Types</option>
              <option v-for="type in investmentTypes" :key="type" :value="type">
                {{ formatType(type) }}
              </option>
            </select>
            <div class="select-arrow">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div v-if="showRiskFilter" class="filter-group">
          <label class="filter-label">Risk Level</label>
          <div class="filter-dropdown">
            <select
              v-model="localFilters.riskLevel"
              @change="handleFilterChange"
              class="filter-select"
            >
              <option value="">All Risk Levels</option>
              <option
                v-for="option in riskLevelOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="select-arrow">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <!-- Slot for additional filters -->
        <slot name="additional-filters" :filters="localFilters" />
      </div>
    </div>

    <!-- Active Filters Display -->
    <div class="active-filters-display" v-if="hasActiveFilters">
      <div class="filter-tags">
        <div v-if="localFilters.name" class="filter-tag">
          <span class="tag-label">Search:</span>
          <span class="tag-value">{{ localFilters.name }}</span>
          <button @click="clearFilter('name')" class="tag-remove">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div v-if="localFilters.type" class="filter-tag">
          <span class="tag-label">Type:</span>
          <span class="tag-value">{{ formatType(localFilters.type) }}</span>
          <button @click="clearFilter('type')" class="tag-remove">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div v-if="localFilters.riskLevel" class="filter-tag">
          <span class="tag-label">Risk:</span>
          <span class="tag-value">{{
            getRiskLevelLabel(localFilters.riskLevel)
          }}</span>
          <button @click="clearFilter('riskLevel')" class="tag-remove">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, computed } from "vue";
import { formatType } from "../../utils/formatters";
import { RISK_LEVEL_OPTIONS } from "../../utils/constants";

export default {
  name: "SearchFilterPanel",
  props: {
    filters: {
      type: Object,
      required: true,
    },
    investmentTypes: {
      type: Array,
      default: () => [],
    },
    showTypeFilter: {
      type: Boolean,
      default: true,
    },
    showRiskFilter: {
      type: Boolean,
      default: true,
    },
    searchPlaceholder: {
      type: String,
      default: "Search investments, funds, bonds...",
    },
  },
  emits: ["filter-change", "apply-filters", "clear-filters"],
  setup(props, { emit }) {
    const localFilters = reactive({ ...props.filters });
    const riskLevelOptions = RISK_LEVEL_OPTIONS;

    const hasActiveFilters = computed(() => {
      return localFilters.name || localFilters.type || localFilters.riskLevel;
    });

    const activeFilterCount = computed(() => {
      let count = 0;
      if (localFilters.name) count++;
      if (localFilters.type) count++;
      if (localFilters.riskLevel) count++;
      return count;
    });

    // Watch for external filter changes
    watch(
      () => props.filters,
      (newFilters) => {
        Object.assign(localFilters, newFilters);
      },
      { deep: true }
    );

    const handleFilterChange = () => {
      emit("filter-change", { ...localFilters });
    };

    const handleApplyFilters = () => {
      emit("apply-filters", { ...localFilters });
    };

    const handleClearFilters = () => {
      const clearedFilters = {
        name: "",
        type: "",
        riskLevel: "",
      };
      Object.assign(localFilters, clearedFilters);
      emit("clear-filters", { ...clearedFilters });
    };

    const clearSearchTerm = () => {
      localFilters.name = "";
      handleFilterChange();
    };

    const clearFilter = (filterKey) => {
      localFilters[filterKey] = "";
      handleFilterChange();
    };

    const getRiskLevelLabel = (value) => {
      const option = riskLevelOptions.find((opt) => opt.value === value);
      return option ? option.label : value;
    };

    return {
      localFilters,
      riskLevelOptions,
      hasActiveFilters,
      activeFilterCount,
      formatType,
      handleFilterChange,
      handleApplyFilters,
      handleClearFilters,
      clearSearchTerm,
      clearFilter,
      getRiskLevelLabel,
    };
  },
};
</script>

<style scoped>
.search-filter-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-content .panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.panel-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 400;
}

.active-filters .active-count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #6b7280;
  z-index: 2;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: white;
  transition: all 0.2s ease;
  color: #374151;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.search-input:focus + .search-icon {
  color: #3b82f6;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  z-index: 2;
}

.clear-search-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.search-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  justify-content: center;
}

.search-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.search-btn:active {
  transform: translateY(0);
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.clear-all-btn {
  background: none;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.clear-all-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.filter-dropdown {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 2rem 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  transition: color 0.2s ease;
}

.filter-select:focus + .select-arrow {
  color: #3b82f6;
}

.active-filters-display {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tag {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 0.375rem 0.625rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag-label {
  font-weight: 500;
  color: #6b7280;
}

.tag-value {
  color: #374151;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.tag-remove:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 768px) {
  .search-filter-panel {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .panel-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .search-box {
    flex-direction: column;
  }

  .filter-controls {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filter-tags {
    gap: 0.5rem;
  }

  .panel-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .search-filter-panel {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-input {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
  }

  .search-btn {
    padding: 0.875rem 1.25rem;
    min-width: 100px;
  }
}
</style>