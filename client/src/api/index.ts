import axios, { AxiosResponse } from "axios";

export const url = (path: string): string => {
  const url = new URL(window.location.href);
  url.port = "3001";
  url.pathname = `/api/${path}`;
  return url.href;
};

export const get = (path: string): Promise<AxiosResponse<any>> =>
  axios.get(url(path));

export const post = (path: string, data?: any): Promise<AxiosResponse<any>> =>
  axios.post(url(path), data);

export const del = (path: string): Promise<AxiosResponse<any>> =>
  axios.delete(url(path));
