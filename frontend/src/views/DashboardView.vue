<script setup>
import { logout } from '../Authentication/auth';

const handleLogout = () => {
    logout();
}
</script>

<template>
    <h2>This is a protected view</h2>
    <button @click="handleLogout">Logout</button>
</template>