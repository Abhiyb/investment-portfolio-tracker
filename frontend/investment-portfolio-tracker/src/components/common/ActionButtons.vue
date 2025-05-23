<template>
  <div class="action-buttons">
    <button v-if="showEdit" @click="$emit('edit')" class="action-btn edit-btn">
      {{ editText }}
    </button>

    <button
      v-if="showDelete"
      @click="$emit('delete')"
      class="action-btn delete-btn"
    >
      {{ deleteText }}
    </button>

    <button
      v-if="showPrimary"
      @click="$emit('primary')"
      class="action-btn primary-btn"
    >
      {{ primaryText }}
    </button>

    <div v-if="showInactive" class="inactive-badge">
      {{ inactiveText }}
    </div>
  </div>
</template>
  
  <script>
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
  emits: ["edit", "delete", "primary"],
};
</script>
  
  <style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.edit-btn:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.delete-btn {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.delete-btn:hover {
  background-color: #fecaca;
  border-color: #fca5a5;
}

.primary-btn {
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.primary-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.inactive-badge {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #6b7280;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>