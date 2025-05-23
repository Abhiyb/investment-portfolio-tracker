// composables/useInvestmentData.js
import { ref, reactive } from 'vue';
import { DEFAULT_FORM_DATA } from '../utils/constants';

export function useInvestmentData(service) {
  // State
  const investments = ref([]);
  const investmentTypes = ref([]);
  const riskTypes = ref([]);
  const isLoading = ref(false);
  const error = ref('');

  // Form data
  const formData = reactive({ ...DEFAULT_FORM_DATA });
  const currentInvestmentId = ref(null);

  // Load investments
  const loadInvestments = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const data = await service.getInvestments();
      investments.value = data;
    } catch (err) {
      error.value = err.message || 'Failed to load investments';
      console.error('Error loading investments:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Load investment types
  const loadInvestmentTypes = async () => {
    try {
      const data = await service.getInvestmentTypes();
      investmentTypes.value = data;
    } catch (err) {
      console.error('Error loading investment types:', err);
    }
  };

  // Load risk types
  const loadRiskTypes = async () => {
    try {
      // Check if service has getRiskTypes method (admin service)
      if (service.getRiskTypes) {
        const data = await service.getRiskTypes();
        riskTypes.value = data;
      }
    } catch (err) {
      console.error('Error loading risk types:', err);
    }
  };

  // Filter investments
  const filterInvestments = async (filters) => {
    isLoading.value = true;
    error.value = '';

    try {
      const data = await service.filterInvestments(filters);
      investments.value = data;
    } catch (err) {
      error.value = err.message || 'Failed to filter investments';
      console.error('Error filtering investments:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Add investment (admin only)
  const addInvestment = async (investmentData) => {
    if (!service.addInvestment) {
      throw new Error('Add investment not supported by this service');
    }

    try {
      await service.addInvestment(investmentData);
      await loadInvestments(); // Refresh the list
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to add investment');
    }
  };

  // Update investment (admin only)
  const updateInvestment = async (id, investmentData) => {
    if (!service.updateInvestment) {
      throw new Error('Update investment not supported by this service');
    }

    try {
      await service.updateInvestment(id, investmentData);
      await loadInvestments(); // Refresh the list
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to update investment');
    }
  };

  // Delete investment (admin only)
  const deleteInvestment = async (id) => {
    if (!service.deleteInvestment) {
      throw new Error('Delete investment not supported by this service');
    }

    try {
      await service.deleteInvestment(id);
      await loadInvestments(); // Refresh the list
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to delete investment');
    }
  };

  // Form helpers
  const resetFormData = () => {
    Object.assign(formData, DEFAULT_FORM_DATA);
    currentInvestmentId.value = null;
  };

  const setFormData = (investment) => {
    Object.assign(formData, {
      id: investment.id,
      name: investment.name,
      type: investment.type,
      riskLevel: investment.riskLevel,
      description: investment.description,
      currentNetAssetValuePerUnit: investment.currentNetAssetValuePerUnit,
      expectedAnnualReturnRate: investment.expectedAnnualReturnRate,
      minimumInvestment: investment.minimumInvestment,
      isActive: investment.isActive !== false
    });
    currentInvestmentId.value = investment.id;
  };

  // Initialize data
  const initialize = async () => {
    await Promise.all([
      loadInvestments(),
      loadInvestmentTypes(),
      loadRiskTypes()
    ]);
  };

  return {
    // State
    investments,
    investmentTypes,
    riskTypes,
    isLoading,
    error,
    formData,
    currentInvestmentId,

    // Methods
    loadInvestments,
    loadInvestmentTypes,
    loadRiskTypes,
    filterInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    resetFormData,
    setFormData,
    initialize
  };
}