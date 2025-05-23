<template>
  <div :class="['badge', badgeClass]">
    {{ formattedText }}
  </div>
</template>
  
  <script>
import { computed } from "vue";
import { formatRiskLevel, getRiskClass } from "../../utils/formatters";

export default {
  name: "StatusBadge",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["risk", "status"].includes(value),
    },
    value: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const badgeClass = computed(() => {
      if (props.type === "risk") {
        return getRiskClass(props.value);
      }
      if (props.type === "status") {
        return props.value.toLowerCase() === "active"
          ? "status-active"
          : "status-inactive";
      }
      return "";
    });

    const formattedText = computed(() => {
      let text = "";
      if (props.type === "risk") {
        text = formatRiskLevel(props.value);
      } else {
        text = props.value;
      }
      return props.suffix ? `${text} ${props.suffix}` : text;
    });

    return {
      badgeClass,
      formattedText,
    };
  },
};
</script>
  
  <style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.risk-low {
  background-color: #dcfce7;
  color: #166534;
}

.risk-medium {
  background-color: #fff7ed;
  color: #9a3412;
}

.risk-high {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-active {
  background-color: #dcfce7;
  color: #166534;
}

.status-inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>