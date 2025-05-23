// composables/useFilters.js
import { ref, reactive } from 'vue';

export function useFilters(initialFilters = {}) {
    const defaultFilters = {
        name: '',
        type: '',
        riskLevel: '',
        ...initialFilters
    };

    const filters = reactive({ ...defaultFilters });
    const isLoading = ref(false);

    const clearFilters = () => {
        Object.assign(filters, defaultFilters);
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some(value => value !== '' && value !== null);
    };

    const getFilterPayload = () => {
        return {
            type: filters.type || null,
            riskLevel: filters.riskLevel || null,
            searchTerm: filters.name || null
        };
    };

    return {
        filters,
        isLoading,
        clearFilters,
        hasActiveFilters,
        getFilterPayload
    };
}