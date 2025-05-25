<template>
  <div class="action-buttons">
    <!-- Edit and Toggle Container - Now centered -->
    <div v-if="showEdit || showToggle" class="edit-toggle-container">
      <!-- Enhanced Edit Button -->
      <button
        v-if="showEdit"
        @click="$emit('edit')"
        class="action-btn edit-btn"
      >
        <svg
          class="edit-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          ></path>
          <path
            d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          ></path>
        </svg>
        {{ editText }}
      </button>

      <!-- Enhanced Toggle Button with inline text -->
      <div v-if="showToggle" class="toggle-container">
        <label class="toggle-switch">
          <input
            type="checkbox"
            :checked="isActive"
            @change="handleToggleChange"
            class="toggle-input"
          />
          <span class="toggle-slider">
            <span class="toggle-thumb">
              <!-- Active Icon -->
              <svg
                v-if="localIsActive"
                class="toggle-icon active-icon"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <!-- Inactive Icon -->
              <svg
                v-else
                class="toggle-icon inactive-icon"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
          </span>
        </label>
        <span class="toggle-label" :class="{ active: localIsActive }">
          {{ localIsActive ? "Active" : "Inactive" }}
        </span>
      </div>
    </div>

    <!-- Legacy Delete Button -->
    <button
      v-if="showDelete"
      @click="$emit('delete')"
      class="action-btn delete-btn"
    >
      <svg
        class="delete-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="3,6 5,6 21,6"></polyline>
        <path
          d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"
        ></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      {{ deleteText }}
    </button>

    <!-- Primary Action Button -->
    <button
      v-if="showPrimary"
      @click="$emit('primary')"
      class="action-btn primary-btn"
    >
      <svg
        class="primary-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      {{ primaryText }}
    </button>

    <!-- Inactive Badge -->
    <div v-if="showInactive" class="inactive-badge">
      <svg
        class="inactive-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      {{ inactiveText }}
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "ActionButtons",
  props: {
    showEdit: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    showToggle: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showPrimary: {
      type: Boolean,
      default: false,
    },
    showInactive: {
      type: Boolean,
      default: false,
    },
    editText: {
      type: String,
      default: "Edit",
    },
    deleteText: {
      type: String,
      default: "Delete",
    },
    primaryText: {
      type: String,
      default: "Action",
    },
    inactiveText: {
      type: String,
      default: "Inactive",
    },
  },
  emits: ["edit", "delete", "primary", "toggle"],
  setup(props, { emit }) {
    const localIsActive = ref(props.isActive);

    // Watch for changes in the prop and update local state
    watch(
      () => props.isActive,
      (newValue) => {
        localIsActive.value = newValue;
      }
    );

    const handleToggleChange = (event) => {
      const newValue = event.target.checked;
      localIsActive.value = newValue;
      emit("toggle", newValue);
    };

    return {
      localIsActive,
      handleToggleChange,
    };
  },
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

/* Container for edit and toggle - Now centered horizontally */
.edit-toggle-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
  color: #475569;
  position: relative;
  overflow: hidden;
}

.edit-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s;
}

.edit-btn:hover::before {
  left: 100%;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #94a3b8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-icon {
  transition: transform 0.2s ease;
}

.edit-btn:hover .edit-icon {
  transform: scale(1.1);
}

.delete-btn {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #fca5a5;
  color: #b91c1c;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(185, 28, 28, 0.2);
}

.delete-icon {
  transition: transform 0.2s ease;
}

.delete-btn:hover .delete-icon {
  transform: scale(1.1);
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #2563eb;
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.primary-icon {
  transition: transform 0.2s ease;
}

.primary-btn:hover .primary-icon {
  transform: translateX(2px);
}

.inactive-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #d1d5db;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Toggle Switch Styles - Updated Layout */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: relative;
  display: block;
  width: 52px;
  height: 28px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 34px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(0);
}

.toggle-input:checked + .toggle-slider .toggle-thumb {
  transform: translateX(24px);
}

.toggle-icon {
  transition: all 0.2s ease;
  opacity: 0.9;
}

.active-icon {
  color: #059669;
}

.inactive-icon {
  color: #dc2626;
}

.toggle-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 55px;
}

.toggle-label.active {
  color: #059669;
}

/* Hover Effects */
.toggle-switch:hover .toggle-slider {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch:hover .toggle-thumb {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.toggle-input:focus + .toggle-slider {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .action-buttons {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .edit-toggle-container {
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .toggle-container {
    gap: 0.5rem;
  }

  .toggle-slider {
    width: 48px;
    height: 26px;
  }

  .toggle-thumb {
    width: 22px;
    height: 22px;
  }

  .toggle-input:checked + .toggle-slider .toggle-thumb {
    transform: translateX(22px);
  }

  .toggle-label {
    font-size: 0.75rem;
    min-width: 50px;
  }

  .action-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .edit-toggle-container {
    gap: 0.5rem;
    justify-content: center;
  }

  .toggle-slider {
    width: 44px;
    height: 24px;
  }

  .toggle-thumb {
    width: 20px;
    height: 20px;
  }

  .toggle-input:checked + .toggle-slider .toggle-thumb {
    transform: translateX(20px);
  }

  .toggle-icon {
    width: 10px;
    height: 10px;
  }

  .toggle-container {
    gap: 0.4rem;
  }
}
</style>