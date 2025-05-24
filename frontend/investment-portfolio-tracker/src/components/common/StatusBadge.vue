<template>
  <span :class="['status-badge', badgeClass]">
    <span v-if="showIcon" class="badge-icon">{{ badgeIcon }}</span>
    {{ displayText }}
  </span>
</template>

<script>
import { computed } from "vue";

export default {
  name: "StatusBadge",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["risk", "status", "type"].includes(value),
    },
    value: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      default: "",
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const badgeClass = computed(() => {
      if (props.type === "risk") {
        return `badge-risk-${props.value.toLowerCase()}`;
      } else if (props.type === "status") {
        return `badge-status-${props.value.toLowerCase()}`;
      } else {
        return "badge-default";
      }
    });

    const badgeIcon = computed(() => {
      if (props.type === "risk") {
        switch (props.value.toUpperCase()) {
          case "LOW":
            return "🟢";
          case "MEDIUM":
            return "🟡";
          case "HIGH":
            return "🔴";
          default:
            return "⚪";
        }
      }
      return "";
    });

    const displayText = computed(() => {
      const formattedValue =
        props.value.charAt(0).toUpperCase() +
        props.value.slice(1).toLowerCase();
      return props.suffix
        ? `${formattedValue} ${props.suffix}`
        : formattedValue;
    });

    return {
      badgeClass,
      badgeIcon,
      displayText,
    };
  },
};
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.badge-icon {
  font-size: 0.875rem;
}

/* Risk badges */
.badge-risk-low {
  background: #dcfdf7;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-risk-medium {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.badge-risk-high {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

/* Status badges */
.badge-status-active {
  background: #dcfdf7;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-status-inactive {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Default badge */
.badge-default {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}
</style>