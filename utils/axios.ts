import axios from 'axios';
import { HOST_API } from './config';

const axiosInstance = axios.create({ baseURL: HOST_API });

export default axiosInstance;

export const httpGet = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

export const httpPost = async (url: string, data: object) => {
  const response = await axiosInstance.post(url, data);

  return response.data;
};
