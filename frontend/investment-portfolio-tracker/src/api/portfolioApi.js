import axios from 'axios';


const createAxiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: import.meta.env.BACKEND_SERVER_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

export const getPortfolioAllocation = () => createAxiosInstance().get('/portfolio/allocation');
export const getPortfolioSummary = () => createAxiosInstance().get('/portfolio/summary');
export const getPortfolioGains = () => createAxiosInstance().get('/portfolio/gains');
export const buyInvestment = (data) => createAxiosInstance().post('/portfolio/buy', data);
export const sellInvestment = (data) => createAxiosInstance().post('/portfolio/sell', data);
export const getHoldings = () => createAxiosInstance().get('/portfolio');
export const getTransactions = () => createAxiosInstance().get('/portfolio/transactions');