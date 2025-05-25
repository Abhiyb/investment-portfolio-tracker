<template>
  <form @submit.prevent="handleSubmit" class="investment-form">
    <!-- Form Grid Layout -->
    <div class="form-grid">
      <!-- Left Column -->
      <div class="form-column">
        <div class="form-group">
          <label for="name" class="form-label">
            <span class="label-text">Product Name</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              type="text"
              id="name"
              v-model="localFormData.name"
              required
              class="form-input"
              placeholder="Enter product name"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="type" class="form-label">
            <span class="label-text">Investment Type</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <select
              id="type"
              v-model="localFormData.type"
              required
              class="form-select"
            >
              <option value="" disabled>Select investment type</option>
              <option v-for="type in investmentTypes" :key="type" :value="type">
                {{ formatType(type) }}
              </option>
            </select>
            <div class="select-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="riskLevel" class="form-label">
            <span class="label-text">Risk Level</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <select
              id="riskLevel"
              v-model="localFormData.riskLevel"
              required
              class="form-select"
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
            <div class="select-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="currentNetAssetValuePerUnit" class="form-label">
            <span class="label-text">Current NAV</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper currency-input">
            <span class="currency-symbol">$</span>
            <input
              type="number"
              id="currentNetAssetValuePerUnit"
              v-model="localFormData.currentNetAssetValuePerUnit"
              required
              step="0.01"
              min="0"
              class="form-input with-symbol"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="form-column">
        <div class="form-group">
          <label for="expectedAnnualReturnRate" class="form-label">
            <span class="label-text">Expected Annual Return</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper percentage-input">
            <input
              type="number"
              id="expectedAnnualReturnRate"
              v-model="localFormData.expectedAnnualReturnRate"
              required
              step="0.01"
              min="0"
              class="form-input with-symbol"
              placeholder="0.00"
            />
            <span class="percentage-symbol">%</span>
          </div>
        </div>

        <div class="form-group">
          <label for="minimumInvestment" class="form-label">
            <span class="label-text">Minimum Investment</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper currency-input">
            <span class="currency-symbol">$</span>
            <input
              type="number"
              id="minimumInvestment"
              v-model="localFormData.minimumInvestment"
              required
              step="0.01"
              min="0"
              class="form-input with-symbol"
              placeholder="0.00"
            />
          </div>
        </div>

        <div v-if="mode === 'edit'" class="form-group">
          <div class="checkbox-wrapper">
            <label class="checkbox-container">
              <input
                type="checkbox"
                v-model="localFormData.isActive"
                class="checkbox-input"
              />
              <div class="checkbox-custom">
                <svg
                  class="checkbox-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span class="checkbox-label">Active Status</span>
            </label>
          </div>
        </div>

        <!-- Description spans full width in right column -->
        <div class="form-group description-group">
          <label for="description" class="form-label">
            <span class="label-text">Description</span>
          </label>
          <div class="input-wrapper">
            <textarea
              id="description"
              v-model="localFormData.description"
              class="form-textarea"
              placeholder="Enter investment description..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Error and Success Messages -->
    <div v-if="error" class="message error-message">
      <div class="message-icon error-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      {{ error }}
    </div>

    <div v-if="success" class="message success-message">
      <div class="message-icon success-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      {{ success }}
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
        <svg
          class="btn-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <svg
          v-if="!isLoading"
          class="btn-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
          class="btn-icon animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
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
  padding: 2rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.description-group {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  letter-spacing: 0.025em;
}

.label-text {
  color: #1f2937;
}

.required {
  color: #ef4444;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1e398a;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: #fefefe;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.form-select {
  appearance: none;
  cursor: pointer;
  padding-right: 3rem;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
  width: 1.25rem;
  height: 1.25rem;
}

.currency-input .currency-symbol,
.percentage-input .percentage-symbol {
  position: absolute;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9375rem;
  z-index: 1;
}

.currency-input .currency-symbol {
  left: 1rem;
}

.percentage-input .percentage-symbol {
  right: 1rem;
}

.form-input.with-symbol {
  padding-left: 2.5rem;
}

.percentage-input .form-input.with-symbol {
  padding-left: 1rem;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 4rem;
  font-family: inherit;
}

.checkbox-wrapper {
  padding: 1rem 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  background: #ffffff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #1e398a 0%, #1d4ed8 100%);
  border-color: #1e398a;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.25);
}

.checkbox-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-input:checked + .checkbox-custom .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.message-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.error-message {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.error-icon {
  color: #ef4444;
}

.success-message {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #166534;
  border: 1px solid #bbf7d0;
}

.success-icon {
  color: #22c55e;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  white-space: nowrap;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.btn-secondary {
  background: #ffffff;
  color: #6b7280;
  border-color: #d1d5db;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #93c5fd 0%, #bfdbfe 100%);
  border-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .investment-form {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-column {
    gap: 1.25rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .investment-form {
    padding: 1rem;
  }

  .form-grid {
    gap: 1rem;
  }

  .form-column {
    gap: 1rem;
  }

  .form-label {
    font-size: 0.8125rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
  }
}
</style>