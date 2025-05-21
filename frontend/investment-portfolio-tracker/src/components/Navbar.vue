<template>
    <header class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <div class="logo-icon">IP</div>
          <span class="logo-text">InvestPort</span>
        </div>
        <nav class="nav-links">
          <!-- <a href="#" class="nav-link">Dashboard</a>
          <a href="#" class="nav-link">Investments</a>
          <a href="#" class="nav-link">Portfolio</a>
          <a href="#" class="nav-link active">Transactions</a>
          <a href="#" class="nav-link">Support</a> -->
        </nav>
      </div>
      <div class="navbar-right">
        <div class="user-initials">JD</div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppNavbar'
  }
  </script>
  
  <style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
    margin-right: 30px;
  }
  
  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: #1e3a8a;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #1e3a8a;
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    text-decoration: none;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 0;
  }
  
  .nav-link.active {
    color: #1e3a8a;
    font-weight: 600;
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
  }
  
  .user-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: #f3f4f6;
    color: #1e3a8a;
    border-radius: 50%;
    font-weight: 600;
    font-size: 14px;
  }
  </style>