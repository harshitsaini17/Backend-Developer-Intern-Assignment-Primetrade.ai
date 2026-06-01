import api from './client';
import type { ApiResponse, Task, TaskFormData } from '../types';

export const taskApi = {
  getMyTasks: async (params?: { status?: string; priority?: string }): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  },

  getAllTasks: async (params?: { status?: string; priority?: string; userId?: string }): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/all', { params });
    return response.data;
  },

  getTask: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: TaskFormData): Promise<ApiResponse<Task>> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<ApiResponse<Task>> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/tasks/${id}`);
    return response.data;
  },
};