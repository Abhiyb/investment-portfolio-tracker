// composables/useModal.js
import { ref } from 'vue';

export function useModal() {
    const isOpen = ref(false);
    const isLoading = ref(false);
    const error = ref('');
    const success = ref('');

    const openModal = () => {
        isOpen.value = true;
        clearMessages();
    };

    const closeModal = () => {
        isOpen.value = false;
        isLoading.value = false;
        clearMessages();
    };

    const clearMessages = () => {
        error.value = '';
        success.value = '';
    };

    const setLoading = (loading) => {
        isLoading.value = loading;
    };

    const setError = (errorMessage) => {
        error.value = errorMessage;
    };

    const setSuccess = (successMessage) => {
        success.value = successMessage;
        setTimeout(() => {
            closeModal();
        }, 1500);
    };

    return {
        isOpen,
        isLoading,
        error,
        success,
        openModal,
        closeModal,
        clearMessages,
        setLoading,
        setError,
        setSuccess
    };
}