<template>
  <div class="investment-grid-container">
    <!-- Loading State -->
    <LoadingSpinner v-if="isLoading" :message="loadingMessage" />

    <!-- Empty State -->
    <div v-else-if="investments.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>{{ emptyTitle }}</h3>
      <p>{{ emptyMessage }}</p>
      <button
        v-if="showEmptyAction"
        @click="$emit('empty-action')"
        class="empty-action-btn"
      >
        {{ emptyActionText }}
      </button>
    </div>

    <!-- Investment Grid -->
    <div v-else class="investment-grid">
      <InvestmentCard
        v-for="investment in investments"
        :key="investment.id"
        :investment="investment"
        :show-risk-badge="showRiskBadge"
        :show-risk-level="showRiskLevel"
        :show-description="showDescription"
        :show-actions="showActions"
        :show-edit="showEdit"
        :show-delete="showDelete"
        :show-primary="showPrimary"
        :show-inactive="showInactive"
        :primary-action-text="primaryActionText"
        :show-footer-action="showFooterAction"
        :footer-action-text="footerActionText"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @primary-action="$emit('primary-action', $event)"
        @footer-action="$emit('footer-action', $event)"
      />
    </div>

    <!-- Pagination could go here if needed -->
    <slot name="pagination" />
  </div>
</template>
  
  <script>
import LoadingSpinner from "../common/LoadingSpinner.vue";
import InvestmentCard from "./InvestmentCard.vue";

export default {
  name: "InvestmentGrid",
  components: {
    LoadingSpinner,
    InvestmentCard,
  },
  props: {
    investments: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    loadingMessage: {
      type: String,
      default: "Loading investments...",
    },
    emptyTitle: {
      type: String,
      default: "No investments found",
    },
    emptyMessage: {
      type: String,
      default: "No investments match your current filters.",
    },
    showEmptyAction: {
      type: Boolean,
      default: false,
    },
    emptyActionText: {
      type: String,
      default: "Add Investment",
    },
    // Card display options
    showRiskBadge: {
      type: Boolean,
      default: true,
    },
    showRiskLevel: {
      type: Boolean,
      default: false,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    showPrimary: {
      type: Boolean,
      default: false,
    },
    showInactive: {
      type: Boolean,
      default: false,
    },
    primaryActionText: {
      type: String,
      default: "Action",
    },
    showFooterAction: {
      type: Boolean,
      default: false,
    },
    footerActionText: {
      type: String,
      default: "Invest Now",
    },
  },
  emits: ["edit", "delete", "primary-action", "footer-action", "empty-action"],
};
</script>
  
  <style scoped>
.investment-grid-container {
  width: 100%;
}

.investment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.empty-action-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-action-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .investment-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}
</style>