import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

let tokenGetter = () => null;
let onUnauthorized = () => {};

export const configureApiClient = ({ getToken, onUnauthorized: handler }) => {
  if (typeof getToken === 'function') tokenGetter = getToken;
  if (typeof handler === 'function') onUnauthorized = handler;
};

apiClient.interceptors.request.use(config => {
  const token = tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(err);
  },
);

export default apiClient;
