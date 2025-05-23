<template>
  <div class="investment-card">
    <div class="card-header">
      <h3>{{ investment.name }}</h3>
      <div class="header-badges">
        <StatusBadge
          v-if="showRiskBadge"
          type="risk"
          :value="investment.riskLevel"
          suffix="Risk"
        />
        <ActionButtons
          v-if="showActions"
          :show-edit="showEdit"
          :show-delete="showDelete && investment.active"
          :show-primary="showPrimary"
          :show-inactive="showInactive && !investment.active"
          :primary-text="primaryActionText"
          @edit="$emit('edit', investment)"
          @delete="$emit('delete', investment)"
          @primary="$emit('primary-action', investment)"
        />
      </div>
    </div>

    <div class="card-details">
      <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">{{ formatType(investment.type) }}</span>
      </div>

      <div v-if="showRiskLevel" class="detail-row">
        <span class="detail-label">Risk Level:</span>
        <span class="detail-value">{{
          formatRiskLevel(investment.riskLevel)
        }}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Expected Return:</span>
        <span class="detail-value">{{
          formatPercentage(investment.expectedAnnualReturnRate)
        }}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Current NAV:</span>
        <span class="detail-value">{{
          formatCurrency(investment.currentNetAssetValuePerUnit)
        }}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Minimum Investment:</span>
        <span class="detail-value">{{
          formatCurrency(investment.minimumInvestment)
        }}</span>
      </div>

      <div
        v-if="investment.description && showDescription"
        class="investment-description"
      >
        {{ investment.description }}
      </div>
    </div>

    <div v-if="showFooterAction" class="card-footer">
      <button
        class="footer-action-btn"
        @click="$emit('footer-action', investment)"
      >
        {{ footerActionText }}
      </button>
    </div>
  </div>
</template>
  
  <script>
import StatusBadge from "../common/StatusBadge.vue";
import ActionButtons from "../common/ActionButtons.vue";
import {
  formatType,
  formatRiskLevel,
  formatCurrency,
  formatPercentage,
} from "../../utils/formatters";

export default {
  name: "InvestmentCard",
  components: {
    StatusBadge,
    ActionButtons,
  },
  props: {
    investment: {
      type: Object,
      required: true,
    },
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
  emits: ["edit", "delete", "primary-action", "footer-action"],
  setup() {
    return {
      formatType,
      formatRiskLevel,
      formatCurrency,
      formatPercentage,
    };
  },
};
</script>
  
  <style scoped>
.investment-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.investment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-header h3 {
  color: #1e293b;
  font-size: 1.125rem;
  margin: 0;
  flex-grow: 1;
}

.header-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.card-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: #475569;
  font-size: 0.9375rem;
}

.detail-value {
  color: #1e293b;
  font-size: 0.9375rem;
}

.investment-description {
  margin-top: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.footer-action-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.footer-action-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-badges {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>