<!-- InvestmentAdmin.vue -->
<template>
  <div class="investment-admin">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1>Investments</h1>
        <p class="subtitle">
          Explore and manage a variety of financial instruments.
        </p>
      </div>
      <div class="header-actions">
        <button @click="openAddModal" class="add-btn">+ Add Investment</button>
      </div>
    </div>

    <!-- Search and Filter Panel -->
    <SearchFilterPanel
      :filters="filters"
      :investment-types="investmentTypes"
      search-placeholder="Search by product name..."
      @filter-change="handleFilterChange"
      @apply-filters="applyFilters"
      @clear-filters="clearFilters"
    />

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
      :show-risk-level="true"
      @edit="openEditModal"
      @delete="confirmDelete"
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
        <p>
          Are you sure you want to delete
          <strong>{{ investmentToDelete?.name }}</strong
          >?
        </p>
        <p class="delete-info">
          This will set the investment to inactive. It won't be visible to users
          but will be preserved in the database.
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

      // Modal states
      addModalState,
      editModalState,
      deleteModalState,

      // Methods
      handleFilterChange,
      applyFilters,
      clearFilters,
      openAddModal,
      closeAddModal,
      handleAddSubmit,
      openEditModal,
      closeEditModal,
      handleEditSubmit,
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-content h1 {
  font-size: 1.75rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
}

.add-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #2563eb;
}

.delete-confirmation p {
  margin-bottom: 0.75rem;
}

.delete-info {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .add-btn {
    width: 100%;
  }
}
</style>