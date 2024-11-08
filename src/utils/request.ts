// import { App } from 'vue';
import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 7600,
  baseURL: process.env.NODE_ENV === 'production' ? '/md-editor-rt' : '',
});

export default axiosInstance;
