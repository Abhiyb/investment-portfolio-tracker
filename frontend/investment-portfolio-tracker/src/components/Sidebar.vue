<template>
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </i>
          <span>Dashboard</span>
        </router-link>
  
        <router-link to="/investments" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 8-6 6-6-6" />
              <path d="M16 14V4" />
              <rect x="2" y="2" width="8" height="8" rx="2" />
              <path d="M10 14H4a2 2 0 0 0-2 2v6" />
              <path d="M22 14h-6a2 2 0 0 0-2 2v6" />
            </svg>
          </i>
          <span>Investments</span>
        </router-link>
  
        <router-link to="/myportfolio" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </i>
          <span>Portfolio</span>
        </router-link>
  
        <router-link to="/transactions" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </i>
          <span>Transactions</span>
        </router-link>
  
        <router-link to="/support" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </i>
          <span>Support</span>
        </router-link>
      </nav>
  
      <div class="sidebar-divider"></div>
  
      <div class="sidebar-section">
        <div class="sidebar-section-title">Account</div>
  
        <router-link to="/profile" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </i>
          <span>Profile</span>
        </router-link>
  
        <router-link to="/settings" class="sidebar-link" active-class="active">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </i>
          <span>Settings</span>
        </router-link>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'AppSidebar'
  }
  </script>
  
  <style>
  .sidebar {
    width: 250px;
    background-color: #f9fafb;
    border-right: 1px solid #e5e7eb;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    text-decoration: none;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
  }
  
  .sidebar-link.active {
    color: #1e3a8a;
    font-weight: 600;
    background-color: rgba(30, 58, 138, 0.05);
  }
  
  .icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
  }
  
  .sidebar-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 20px 0;
  }
  
  .sidebar-section {
    padding: 0 20px;
  }
  
  .sidebar-section-title {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 10px;
  }
  </style>
  