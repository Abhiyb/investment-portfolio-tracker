<!-- InvestmentAdmin.vue -->
<template>
  <div class="investment-admin">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-top">
          <div class="header-text">
            <div class="title-section">
              <h1>Investment Management</h1>
              <div class="investment-count" v-if="investments.length">
                <span class="count-number">{{ investments.length }}</span>
                <span class="count-label">Total Investments</span>
              </div>
            </div>
            <p class="subtitle">
              Create, manage, and monitor all investment products in your
              portfolio.
            </p>
          </div>
          <div class="header-actions">
            <button @click="openAddModal" class="add-btn">
              <svg
                class="add-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Investment
            </button>
            <button
              class="filter-toggle-btn"
              @click="toggleFilters"
              :class="{ active: showFilters }"
            >
              <svg
                class="filter-icon"
                :class="{ rotated: showFilters }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              Filters
              <svg
                class="chevron-icon"
                :class="{ rotated: showFilters }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Search and Filter Panel -->
    <div class="filter-panel-container">
      <Transition name="slide-fade">
        <SearchFilterPanel
          v-show="showFilters"
          :filters="filters"
          :investment-types="investmentTypes"
          search-placeholder="Search by product name..."
          @filter-change="handleFilterChange"
          @apply-filters="applyFilters"
          @clear-filters="clearFilters"
        />
      </Transition>
    </div>

    <!-- Investment Grid -->
    <InvestmentGrid
      :investments="investments"
      :is-loading="isLoadingList"
      loading-message="Loading investments..."
      empty-title="No investments found"
      empty-message="No investments found. Add your first investment using the button above."
      :show-empty-action="true"
      empty-action-text="Add Investment"
      :show-actions="true"
      :show-edit="true"
      :show-delete="true"
      :show-inactive="true"
      :show-risk-level="false"
      @edit="openEditModal"
      @delete="confirmDelete"
      @toggle-active="handleToggleActive"
      @empty-action="openAddModal"
    />

    <!-- Add Investment Modal -->
    <BaseModal
      :is-open="addModalState.isOpen"
      title="Add New Investment"
      size="medium"
      :is-loading="addModalState.isLoading"
      :error="addModalState.error"
      :success="addModalState.success"
      :show-actions="false"
      @close="closeAddModal"
    >
      <InvestmentForm
        mode="add"
        :form-data="formData"
        :investment-types="investmentTypes"
        :is-loading="addModalState.isLoading"
        :error="addModalState.error"
        :success="addModalState.success"
        @submit="handleAddSubmit"
        @cancel="closeAddModal"
      />
    </BaseModal>

    <!-- Edit Investment Modal -->
    <BaseModal
      :is-open="editModalState.isOpen"
      title="Edit Investment"
      size="medium"
      :is-loading="editModalState.isLoading"
      :error="editModalState.error"
      :success="editModalState.success"
      :show-actions="false"
      @close="closeEditModal"
    >
      <InvestmentForm
        mode="edit"
        :form-data="formData"
        :investment-types="investmentTypes"
        :is-loading="editModalState.isLoading"
        :error="editModalState.error"
        :success="editModalState.success"
        @submit="handleEditSubmit"
        @cancel="closeEditModal"
      />
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :is-open="deleteModalState.isOpen"
      title="Confirm Delete"
      size="small"
      confirm-type="danger"
      confirm-text="Delete"
      :is-loading="deleteModalState.isLoading"
      :error="deleteModalState.error"
      @close="cancelDelete"
      @cancel="cancelDelete"
      @confirm="executeDelete"
    >
      <div class="delete-confirmation">
        <div class="delete-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="delete-title">
          Are you sure you want to delete
          <strong>{{ investmentToDelete?.name }}</strong
          >?
        </p>
        <p class="delete-info">
          This will set the investment to inactive. It won't be visible to users
          but will be preserved in the database for audit purposes.
        </p>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import SearchFilterPanel from "./SearchFilterPanel.vue";
import InvestmentGrid from "./InvestmentGrid.vue";
import BaseModal from "../forms/BaseModal.vue";
import InvestmentForm from "../forms/InvestmentForm.vue";
import { useFilters } from "../../composables/useFilters";
import { useInvestmentData } from "../../composables/useInvestmentData";
import investmentService from "../../services/investmentService";

export default {
  name: "InvestmentAdmin",
  components: {
    SearchFilterPanel,
    InvestmentGrid,
    BaseModal,
    InvestmentForm,
  },
  setup() {
    // Investment to delete reference
    const investmentToDelete = ref(null);

    // Filter panel visibility state
    const showFilters = ref(false);

    // Use composables
    const { filters, clearFilters: resetFilters } = useFilters();

    // Create separate modal states instead of using the composable
    const addModalState = reactive({
      isOpen: false,
      isLoading: false,
      error: "",
      success: "",
    });

    const editModalState = reactive({
      isOpen: false,
      isLoading: false,
      error: "",
      success: "",
    });

    const deleteModalState = reactive({
      isOpen: false,
      isLoading: false,
      error: "",
      success: "",
    });

    const {
      investments,
      investmentTypes,
      isLoading: isLoadingList,
      formData,
      filterInvestments,
      addInvestment,
      updateInvestment,
      deleteInvestment,
      resetFormData,
      setFormData,
      initialize,
    } = useInvestmentData(investmentService);

    // Filter toggle function
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    // Modal helper functions
    const clearModalMessages = (modalState) => {
      modalState.error = "";
      modalState.success = "";
    };

    const setModalLoading = (modalState, loading) => {
      modalState.isLoading = loading;
    };

    const setModalError = (modalState, errorMessage) => {
      modalState.error = errorMessage;
    };

    const setModalSuccess = (modalState, successMessage) => {
      modalState.success = successMessage;
      setTimeout(() => {
        modalState.isOpen = false;
        clearModalMessages(modalState);
      }, 1500);
    };

    // Filter handling
    const handleFilterChange = (newFilters) => {
      Object.assign(filters, newFilters);
      applyFilters();
    };

    const applyFilters = async () => {
      const filterPayload = {
        type: filters.type || null,
        riskLevel: filters.riskLevel || null,
        searchTerm: filters.name || null,
      };

      await filterInvestments(filterPayload);
    };

    const clearFilters = () => {
      resetFilters();
      initialize(); // Reload all investments
    };

    // Add Investment Modal
    const openAddModal = () => {
      resetFormData();
      clearModalMessages(addModalState);
      addModalState.isOpen = true;
    };

    const closeAddModal = () => {
      addModalState.isOpen = false;
      setModalLoading(addModalState, false);
      clearModalMessages(addModalState);
    };

    const handleAddSubmit = async (investmentData) => {
      setModalLoading(addModalState, true);
      clearModalMessages(addModalState);

      try {
        await addInvestment(investmentData);
        setModalSuccess(addModalState, "Investment added successfully!");
      } catch (error) {
        setModalError(addModalState, error.message);
      } finally {
        setModalLoading(addModalState, false);
      }
    };

    // Edit Investment Modal
    const openEditModal = (investment) => {
      setFormData(investment);
      clearModalMessages(editModalState);
      editModalState.isOpen = true;
    };

    const closeEditModal = () => {
      editModalState.isOpen = false;
      setModalLoading(editModalState, false);
      clearModalMessages(editModalState);
    };

    const handleEditSubmit = async (investmentData) => {
      setModalLoading(editModalState, true);
      clearModalMessages(editModalState);

      try {
        await updateInvestment(formData.id, investmentData);
        setModalSuccess(editModalState, "Investment updated successfully!");
      } catch (error) {
        setModalError(editModalState, error.message);
      } finally {
        setModalLoading(editModalState, false);
      }
    };

    // Toggle Active Status Handler
    const handleToggleActive = async ({ investment, isActive }) => {
      try {
        // Create update payload with just the active status
        const updatePayload = {
          ...investment,
          active: isActive,
        };

        // Call the update investment service
        await updateInvestment(investment.id, updatePayload);

        // Optionally show a success message (you can add toast notifications here)
        console.log(
          `Investment ${investment.name} ${
            isActive ? "activated" : "deactivated"
          } successfully`
        );

        // The investment list should be automatically updated by the composable
      } catch (error) {
        console.error("Error toggling investment status:", error);

        // Optionally show error message to user
        // You might want to add a toast notification system here
        alert(
          `Failed to ${isActive ? "activate" : "deactivate"} investment: ${
            error.message
          }`
        );

        // Reload the investments to revert the UI change
        initialize();
      }
    };

    // Delete Investment Modal
    const confirmDelete = (investment) => {
      investmentToDelete.value = investment;
      clearModalMessages(deleteModalState);
      deleteModalState.isOpen = true;
    };

    const cancelDelete = () => {
      investmentToDelete.value = null;
      deleteModalState.isOpen = false;
      setModalLoading(deleteModalState, false);
      clearModalMessages(deleteModalState);
    };

    const executeDelete = async () => {
      if (!investmentToDelete.value) return;

      setModalLoading(deleteModalState, true);
      clearModalMessages(deleteModalState);

      try {
        await deleteInvestment(investmentToDelete.value.id);
        deleteModalState.isOpen = false;
        investmentToDelete.value = null;
        clearModalMessages(deleteModalState);
      } catch (error) {
        setModalError(deleteModalState, error.message);
      } finally {
        setModalLoading(deleteModalState, false);
      }
    };

    // Initialize on mount
    onMounted(() => {
      initialize();
    });

    return {
      // State
      investments,
      investmentTypes,
      isLoadingList,
      filters,
      formData,
      investmentToDelete,
      showFilters,

      // Modal states
      addModalState,
      editModalState,
      deleteModalState,

      // Methods
      toggleFilters,
      handleFilterChange,
      applyFilters,
      clearFilters,
      openAddModal,
      closeAddModal,
      handleAddSubmit,
      openEditModal,
      closeEditModal,
      handleEditSubmit,
      handleToggleActive,
      confirmDelete,
      cancelDelete,
      executeDelete,
    };
  },
};
</script>

<style scoped>
.investment-admin {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.025em;
}

.investment-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #1e398a 0%, #2563eb 100%);
  border-radius: 2rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.count-number {
  font-size: 1.125rem;
  font-weight: 700;
}

.count-label {
  font-weight: 500;
  opacity: 0.9;
}

.subtitle {
  color: #64748b;
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 400;
  margin: 0;
  max-width: 600px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #1e398a 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.25);
  white-space: nowrap;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #22387b 0%, #1d4ed8 100%);
}

.add-btn:active {
  transform: translateY(0);
}

.add-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}

.filter-toggle-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filter-toggle-btn.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.15);
}

.filter-icon {
  width: 1.125rem;
  height: 1.125rem;
  transition: transform 0.2s ease;
}

.filter-icon.rotated {
  transform: rotate(180deg);
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.filter-panel-container {
  margin-bottom: 2rem;
}

/* Smooth transition animations */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.delete-confirmation {
  text-align: center;
  padding: 1rem 0;
}

.delete-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
}

.delete-icon svg {
  width: 2rem;
  height: 2rem;
}

.delete-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.delete-info {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .header-top {
    gap: 1.5rem;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-content h1 {
    font-size: 1.875rem;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }

  .add-btn,
  .filter-toggle-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .investment-count {
    align-self: flex-start;
  }

  .page-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .header-actions {
    flex-direction: row;
    gap: 1rem;
  }

  .add-btn,
  .filter-toggle-btn {
    flex: 1;
    width: auto;
  }
}

@media (max-width: 480px) {
  .title-section {
    gap: 0.5rem;
  }

  .investment-count {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .count-number {
    font-size: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .add-btn,
  .filter-toggle-btn {
    width: 100%;
  }
}
</style>