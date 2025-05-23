<template>
   <div class="app-container">
    <!-- Import Navbar component -->
    <AppNavbar />
  
  <div class="content-wrapper">
    <!-- Import Sidebar component -->
    <AppSidebar />
  <div class=" main-content">
    
    <main class="investment-content">
      <!-- Admin-only section -->
      <div v-if="isAdmin" class="admin-investment-panel">
        <InvestmentAdmin />
      </div>

      <!-- Regular user section - now uses InvestmentUser component -->
      <div v-else class="user-investment-panel">
        <InvestmentUser />
      </div>
    </main>
  </div></div></div>
</template>

<script>
import { ref, onMounted } from "vue";

import AppNavbar from "../components/Navbar.vue";
import AppSidebar from "../components/Sidebar.vue";
import InvestmentAdmin from "../components/investment/InvestmentAdmin.vue";
import InvestmentUser from "../components/investment/InvestmentUser.vue";

export default {
  name: "InvestmentView",
  components: {
  
    AppNavbar,
    AppSidebar,
    InvestmentAdmin,
    InvestmentUser,
  },
  setup() {
    const isAdmin = ref(false);

    onMounted(() => {
      // Check if user is admin by parsing JWT
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Extract payload from JWT
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));

          // Assuming your JWT contains role information
          isAdmin.value =
            Array.isArray(payload.roles) &&
            payload.roles.includes("ROLE_ADMIN");
        } catch (error) {
          console.error("Error parsing JWT:", error);
          isAdmin.value = false;
        }
      }
    });

    return {
      isAdmin,
    };
  },
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
   /* Content Layout */
   .content-wrapper {
    display: flex;
    flex: 1;
  }
  .main-content {
    flex: 1;
    padding: 30px;
    background-color: #ffffff;
  }

</style>