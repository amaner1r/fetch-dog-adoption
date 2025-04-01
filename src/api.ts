import axios from 'axios';
import { Dog, SearchResponse } from './types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (name: string, email: string) => {
  await api.post('/auth/login', { name, email });
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
  const response = await api.get('/dogs/breeds');
  return response.data;
};

export const searchDogs = async (params: {
  breeds?: string[];
  sort?: string;
  size?: number;
  from?: string;
}): Promise<SearchResponse> => {
  const response = await api.get('/dogs/search', { params });
  return response.data;
};

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
  const response = await api.post('/dogs', ids);
  return response.data;
};

export const getMatch = async (ids: string[]): Promise<{ match: string }> => {
  const response = await api.post('/dogs/match', ids);
  return response.data;
};