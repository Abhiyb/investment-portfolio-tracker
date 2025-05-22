<script setup>
  import { RouterView } from 'vue-router';
  
</script>

<template>
   <!-- <div class="app-container"> -->
    <!-- Import Navbar component -->
    <!-- <AppNavbar /> -->
  
  <!-- <div class="content-wrapper"> -->
    <!-- Import Sidebar component -->
    <!-- <AppSidebar /> -->
    <RouterView/>
  <!-- </div></div> -->
</template>

<script>


export default {
  name: "App",
  components: {
   
  },
};
</script>
