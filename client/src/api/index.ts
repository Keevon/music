import axios, { AxiosResponse } from 'axios';

export const url = (path: string): string => `http://localhost:3001/api/${path}`;

export const get = (path: string): Promise<AxiosResponse<any>> =>
  axios.get(url(path));

export const post = (path: string, data?: any): Promise<AxiosResponse<any>> =>
  axios.post(url(path), data);