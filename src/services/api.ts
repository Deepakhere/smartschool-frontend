import axios from "axios";
import {
  INotice,
  ICreateNoticeRequest,
  IHomework,
  ICreateHomeworkRequest,
  IReport,
  ICreateReportRequest,
  IFee,
  ICreateFeeRequest,
  IStudent,
  ICreateStudentRequest,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API endpoints
export const adminApi = {
  notices: {
    create: (data: ICreateNoticeRequest) =>
      api.post<INotice>("/admin/notices", data),
    update: (id: string, data: Partial<ICreateNoticeRequest>) =>
      api.put<INotice>(`/admin/notices/${id}`, data),
    delete: (id: string) => api.delete(`/admin/notices/${id}`),
    getAll: () => api.get<INotice[]>("/admin/notices"),
  },
  homework: {
    create: (data: ICreateHomeworkRequest) =>
      api.post<IHomework>("/admin/homework", data),
    update: (id: string, data: Partial<ICreateHomeworkRequest>) =>
      api.put<IHomework>(`/admin/homework/${id}`, data),
    delete: (id: string) => api.delete(`/admin/homework/${id}`),
    getAll: () => api.get<IHomework[]>("/admin/homework"),
  },
  reports: {
    create: (data: ICreateReportRequest) =>
      api.post<IReport>("/admin/reports", data),
    update: (id: string, data: Partial<ICreateReportRequest>) =>
      api.put<IReport>(`/admin/reports/${id}`, data),
    getAll: () => api.get<IReport[]>("/admin/reports"),
  },
  fees: {
    create: (data: ICreateFeeRequest) => api.post<IFee>("/admin/fees", data),
    update: (id: string, data: Partial<ICreateFeeRequest>) =>
      api.put<IFee>(`/admin/fees/${id}`, data),
    getAll: () => api.get<IFee[]>("/admin/fees"),
  },
  students: {
    create: (data: ICreateStudentRequest) =>
      api.post<IStudent>("/admin/students", data),
    update: (id: string, data: Partial<ICreateStudentRequest>) =>
      api.put<IStudent>(`/admin/students/${id}`, data),
    delete: (id: string) => api.delete(`/admin/students/${id}`),
    getAll: () => api.get<IStudent[]>("/admin/students"),
  },
};

// Parent API endpoints
export const parentApi = {
  notices: {
    getAll: () => api.get<INotice[]>("/parent/notices"),
  },
  homework: {
    getAll: () => api.get<IHomework[]>("/parent/homework"),
  },
  reports: {
    getByStudent: (studentId: string) =>
      api.get<IReport[]>(`/parent/reports/${studentId}`),
  },
  fees: {
    getByStudent: (studentId: string) =>
      api.get<IFee[]>(`/parent/fees/${studentId}`),
    getPaymentHistory: (studentId: string) =>
      api.get<IFee[]>(`/parent/fees/${studentId}/history`),
  },
  children: {
    getAll: () => api.get<IStudent[]>("/parent/children"),
  },
};

// Auth API endpoints
export const authApi = {
  login: (data: {
    email: string;
    password: string;
    role: "admin" | "parent";
  }) => api.post<{ token: string; role: string }>("/auth/login", data),
  logout: () => api.post("/auth/logout"),
};
