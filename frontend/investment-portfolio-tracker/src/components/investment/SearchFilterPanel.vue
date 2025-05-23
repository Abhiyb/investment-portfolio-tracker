<template>
  <div class="search-filter-panel">
    <div class="search-box">
      <input
        type="text"
        v-model="localFilters.name"
        :placeholder="searchPlaceholder"
        class="search-input"
        @input="handleFilterChange"
      />
      <button class="search-btn" @click="handleApplyFilters">
        <span class="search-icon">🔍</span>
      </button>
    </div>

    <div class="filter-controls">
      <div v-if="showTypeFilter" class="filter-dropdown">
        <select
          v-model="localFilters.type"
          @change="handleFilterChange"
          class="filter-select"
        >
          <option value="">All Investment Types</option>
          <option v-for="type in investmentTypes" :key="type" :value="type">
            {{ formatType(type) }}
          </option>
        </select>
      </div>

      <div v-if="showRiskFilter" class="filter-dropdown">
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
      </div>

      <!-- Slot for additional filters -->
      <slot name="additional-filters" :filters="localFilters" />

      <button @click="handleClearFilters" class="clear-filter-btn">
        Clear Filters
      </button>
    </div>
  </div>
</template>
  
  <script>
import { reactive, watch } from "vue";
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
      default: "Search by product name...",
    },
  },
  emits: ["filter-change", "apply-filters", "clear-filters"],
  setup(props, { emit }) {
    const localFilters = reactive({ ...props.filters });
    const riskLevelOptions = RISK_LEVEL_OPTIONS;

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

    return {
      localFilters,
      riskLevelOptions,
      formatType,
      handleFilterChange,
      handleApplyFilters,
      handleClearFilters,
    };
  },
};
</script>
  
  <style scoped>
.search-filter-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #2563eb;
}

.search-icon {
  font-size: 1.1rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-dropdown {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9375rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

.filter-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.clear-filter-btn {
  padding: 0.8rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9375rem;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background-color: white;
  color: #475569;
  transition: background-color 0.2s;
}

.clear-filter-btn:hover {
  background-color: #f1f5f9;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
  }

  .filter-dropdown {
    width: 100%;
  }

  .clear-filter-btn {
    width: 100%;
  }
}
</style>