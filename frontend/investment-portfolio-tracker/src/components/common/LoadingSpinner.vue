<template>
  <div class="loading-indicator">
    <span class="loader"></span>
    <span>{{ message }}</span>
  </div>
</template>
  
  <script>
export default {
  name: "LoadingSpinner",
  props: {
    message: {
      type: String,
      default: "Loading...",
    },
  },
};
</script>
  
  <style scoped>
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  margin: 2rem 0;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>