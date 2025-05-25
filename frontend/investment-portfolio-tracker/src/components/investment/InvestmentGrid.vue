<template>
  <div class="investment-grid-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-indicator">
        <div class="loader"></div>
        <span class="loading-text">{{ loadingMessage }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="investments.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M3 3v5h5M3 21l6-6 4 4 8-8"></path>
            <path
              d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h8"
            ></path>
          </svg>
        </div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-message">{{ emptyMessage }}</p>
        <button
          v-if="showEmptyAction"
          @click="$emit('empty-action')"
          class="empty-action-btn"
        >
          {{ emptyActionText }}
        </button>
      </div>
    </div>

    <!-- Investment Grid -->
    <div v-else class="investment-grid">
      <div class="grid-header">
        <div class="results-count">
          <span class="count-number">{{ investments.length }}</span>
          <span class="count-text"
            >{{
              investments.length === 1 ? "Investment" : "Investments"
            }}
            Available</span
          >
        </div>
      </div>

      <div class="cards-container">
        <InvestmentCard
          v-for="(investment, index) in investments"
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
          :style="{ 'animation-delay': `${index * 100}ms` }"
          class="fade-in-card"
          @edit="$emit('edit', $event)"
          @primary-action="$emit('primary-action', $event)"
          @footer-action="$emit('footer-action', $event)"
        />
      </div>
    </div>

    <!-- Pagination slot -->
    <slot name="pagination" />
  </div>
</template>
  
<script>
import InvestmentCard from "./InvestmentCard.vue";

export default {
  name: "InvestmentGrid",
  components: {
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
  emits: [
    "edit",
    "delete",
    "primary-action",
    "footer-action",
    "empty-action",
    "toggle-active",
  ],
};
</script>
  
<style scoped>
.investment-grid-container {
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #64748b;
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #1e398a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 20px;
  color: #1e398a;
  margin-bottom: 1.5rem;
}

.empty-title {
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-message {
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

.empty-action-btn {
  background: linear-gradient(135deg, #1e398a 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 2rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(59, 130, 246, 0.4);
}

.investment-grid {
  margin-top: 1.5rem;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.count-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.count-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.fade-in-card {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .empty-content {
    padding: 1.5rem;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
  }

  .empty-title {
    font-size: 1.25rem;
  }

  .grid-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .count-number {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .cards-container {
    gap: 0.75rem;
  }

  .loading-container {
    min-height: 200px;
  }

  .empty-state {
    min-height: 300px;
    margin: 1rem 0;
  }
}
</style>