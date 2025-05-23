<template>
  <form @submit.prevent="handleSubmit" class="investment-form">
    <div class="form-group">
      <label for="name">Product Name</label>
      <input
        type="text"
        id="name"
        v-model="localFormData.name"
        required
        class="form-control"
        placeholder="Enter product name"
      />
    </div>

    <div class="form-group">
      <label for="type">Type</label>
      <select
        id="type"
        v-model="localFormData.type"
        required
        class="form-control"
      >
        <option value="" disabled>Select investment type</option>
        <option v-for="type in investmentTypes" :key="type" :value="type">
          {{ formatType(type) }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="riskLevel">Risk Level</label>
      <select
        id="riskLevel"
        v-model="localFormData.riskLevel"
        required
        class="form-control"
      >
        <option value="" disabled>Select risk level</option>
        <option
          v-for="option in riskLevelOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="localFormData.description"
        required
        class="form-control"
        placeholder="Enter investment description"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="currentNetAssetValuePerUnit">Current NAV</label>
      <input
        type="number"
        id="currentNetAssetValuePerUnit"
        v-model="localFormData.currentNetAssetValuePerUnit"
        required
        step="0.01"
        min="0"
        class="form-control"
        placeholder="Enter current NAV"
      />
    </div>

    <div class="form-group">
      <label for="expectedAnnualReturnRate"
        >Expected Annual Return Rate (%)</label
      >
      <input
        type="number"
        id="expectedAnnualReturnRate"
        v-model="localFormData.expectedAnnualReturnRate"
        required
        step="0.01"
        min="0"
        class="form-control"
        placeholder="Enter expected annual return rate"
      />
    </div>

    <div class="form-group">
      <label for="minimumInvestment">Minimum Investment Amount</label>
      <input
        type="number"
        id="minimumInvestment"
        v-model="localFormData.minimumInvestment"
        required
        step="0.01"
        min="0"
        class="form-control"
        placeholder="Enter minimum investment amount"
      />
    </div>

    <div v-if="mode === 'edit'" class="form-group">
      <label class="checkbox-container">
        Active
        <input type="checkbox" v-model="localFormData.isActive" />
        <span class="checkmark"></span>
      </label>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="cancel-btn">
        Cancel
      </button>
      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? loadingText : submitText }}
      </button>
    </div>
  </form>
</template>
  
  <script>
import { reactive, watch, computed } from "vue";
import { formatType } from "../../utils/formatters";
import {
  RISK_LEVEL_OPTIONS,
  DEFAULT_FORM_DATA,
  INVESTMENT_FORM_MODES,
} from "../../utils/constants";

export default {
  name: "InvestmentForm",
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) =>
        Object.values(INVESTMENT_FORM_MODES).includes(value),
    },
    formData: {
      type: Object,
      default: () => ({ ...DEFAULT_FORM_DATA }),
    },
    investmentTypes: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    success: {
      type: String,
      default: "",
    },
  },
  emits: ["submit", "cancel"],
  setup(props, { emit }) {
    const localFormData = reactive({ ...props.formData });
    const riskLevelOptions = RISK_LEVEL_OPTIONS;

    // Watch for external form data changes
    watch(
      () => props.formData,
      (newData) => {
        Object.assign(localFormData, newData);
      },
      { deep: true }
    );

    const submitText = computed(() => {
      return props.mode === INVESTMENT_FORM_MODES.ADD
        ? "Add Investment"
        : "Update Investment";
    });

    const loadingText = computed(() => {
      return props.mode === INVESTMENT_FORM_MODES.ADD
        ? "Adding..."
        : "Updating...";
    });

    const handleSubmit = () => {
      // Convert numeric string values to numbers
      const payload = {
        ...localFormData,
        currentNetAssetValuePerUnit: parseFloat(
          localFormData.currentNetAssetValuePerUnit
        ),
        expectedAnnualReturnRate: parseFloat(
          localFormData.expectedAnnualReturnRate
        ),
        minimumInvestment: parseFloat(localFormData.minimumInvestment),
      };

      emit("submit", payload);
    };

    return {
      localFormData,
      riskLevelOptions,
      submitText,
      loadingText,
      formatType,
      handleSubmit,
    };
  },
};
</script>
  
  <style scoped>
.investment-form {
  padding: 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-size: 0.9375rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9375rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

textarea.form-control {
  resize: vertical;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #f1f5f9;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.cancel-btn:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.submit-btn {
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.submit-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #93c5fd;
  border-color: #93c5fd;
  cursor: not-allowed;
}
</style>