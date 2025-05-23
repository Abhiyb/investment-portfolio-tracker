import router from "../router";
import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
  
      return decoded.exp && decoded.exp > currentTime;
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }

export function logout() {
    localStorage.removeItem('token')
    router.push('/login');
}