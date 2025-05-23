<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content" :class="modalClass">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <slot />
      </div>

      <div v-if="showActions" class="modal-actions">
        <button
          v-if="showCancel"
          type="button"
          @click="$emit('cancel')"
          class="cancel-btn"
        >
          {{ cancelText }}
        </button>
        <button
          v-if="showConfirm"
          type="button"
          @click="$emit('confirm')"
          class="confirm-btn"
          :class="confirmClass"
          :disabled="isLoading"
        >
          {{ isLoading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "BaseModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    confirmText: {
      type: String,
      default: "Confirm",
    },
    loadingText: {
      type: String,
      default: "Loading...",
    },
    confirmType: {
      type: String,
      default: "primary",
      validator: (value) => ["primary", "danger"].includes(value),
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
  emits: ["close", "cancel", "confirm"],
  computed: {
    modalClass() {
      return {
        "modal-small": this.size === "small",
        "modal-large": this.size === "large",
      };
    },
    confirmClass() {
      return {
        "confirm-danger": this.confirmType === "danger",
      };
    },
  },
};
</script>
  
  <style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 450px;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  color: #1e293b;
  font-size: 1.25rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #1e293b;
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin: 1.5rem;
}

.cancel-btn,
.confirm-btn {
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

.confirm-btn {
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.confirm-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.confirm-btn.confirm-danger {
  background-color: #ef4444;
  border-color: #ef4444;
}

.confirm-btn.confirm-danger:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0 1.5rem 1.5rem;
  font-size: 0.9375rem;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0 1.5rem 1.5rem;
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
}
</style>