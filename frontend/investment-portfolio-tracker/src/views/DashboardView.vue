<script setup>
import { logout } from '../Authentication/auth';
import AppNavbar from '../components/Navbar.vue';
import AppSidebar from '../components/Sidebar.vue';

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="app-container">
    <!-- Navbar -->
    <AppNavbar />

    <div class="content-wrapper">
      <!-- Sidebar -->
      <AppSidebar />
      <h2>This is a protected view</h2>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>
</template>
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
</style>