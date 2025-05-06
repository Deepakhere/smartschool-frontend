import { ReactNode } from "react";

// Notice Types
export interface INotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "holiday" | "announcement";
  createdAt: string;
  updatedAt: string;
}

export interface ICreateNoticeRequest {
  title: string;
  content: string;
  date: string;
  type: "holiday" | "announcement";
}

// Homework Types
export interface IHomework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  subject: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateHomeworkRequest {
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  subject: string;
  attachments?: string[];
}

// Report Types
export interface IReport {
  id: string;
  studentId: string;
  academicYear: string;
  term: string;
  subjects: {
    name: string;
    grade: string;
    remarks: string;
  }[];
  overallRemarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReportRequest {
  studentId: string;
  academicYear: string;
  term: string;
  subjects: {
    name: string;
    grade: string;
    remarks: string;
  }[];
  overallRemarks: string;
}

// Fee Types
export interface IFee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFeeRequest {
  studentId: string;
  amount: number;
  dueDate: string;
  description: string;
}

// Student Types
export interface IStudent {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStudentRequest {
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

export interface IAxiosResponse<T> {
  data: { Data: T; Status: string };
}

export interface IAPIError {
  response: {
    Status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    Error?: {
      message: string;
      name: string;
      code?: string;
      errorCode?: string;
    };
  };
  status: number;
}

export interface IForgetPasswordRequest {
  email: string;
  captcha_token: string | null;
}

export interface ILoginResponse {
  id: string;
  email: string;
  token: string;
  name: string;
  role: "admin" | "parent";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface IForgotPassword {
  email: string;
}

export interface IAddUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "parent";
}

export interface IAddUserValue {
  name: string;
  email: string;
  role: string;
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface IAllUserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface FormData {
  fullname: string;
  email: string;
  role: "admin" | "parent";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface RoleOption {
  value: "admin" | "parent";
  label: string;
  description: string;
  icon: ReactNode;
}

export interface PermissionOption {
  id: keyof FormData["permissions"];
  label: string;
  description: string;
  icon: ReactNode;
}

export interface AddUserModalProps {
  isOpen: boolean;
  formData: FormData;
  isLoadingAddUserDetail: boolean;
  roleOptions: RoleOption[];
  permissionOptions: PermissionOption[];
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handlePermissionChange: (permission: keyof FormData["permissions"]) => void;
}

export interface IUserDetailResponse {
  id: string;
  email: string;
  token: string;
  role: "admin" | "parent";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface IRoleOptionDropDown {
  value: "all" | "admin" | "parent";
  label: string;
  description: string;
  icon: React.ReactNode;
}
