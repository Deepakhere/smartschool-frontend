import { ReactNode } from "react";

export interface INotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  attachmentURL: string;
}

export interface ICreateNoticeRequest {
  title: string;
  content: string;
  type: string;
  date?: string;
  attachment?: File | null;
}

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
    isGlobalAdmin: boolean;
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
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
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

export interface ICreateUpdateUserModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  formData: FormData;
  roleOptions: RoleOption[];
  permissionOptions: PermissionOption[];
  isEditUser: boolean;
  isLoadingAddUserDetail: boolean;
  isLoadingUpdateUserDetail?: boolean;
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handlePermissionChange: (permission: keyof FormData["permissions"]) => void;
}

export interface EditUserModalProps {
  t: (t: string) => string;
  isOpen: boolean;
  formData: FormData;
  isLoadingUpdateUserDetail: boolean;
  roleOptions: RoleOption[];
  permissionOptions: PermissionOption[];
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handlePermissionChange: (permission: keyof FormData["permissions"]) => void;
}

export interface DeleteUserModalProps {
  t: (t: string) => string;
  isOpen: boolean;
  user: IAllUserDetails[];
  userId: string;
  isLoadingDeleteUser: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface DeleteModalProps {
  t: (t: string) => string;
  isOpen: boolean;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface IUpdateUserValue {
  id: string;
  name: string;
  email: string;
  role: "admin" | "parent";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
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
    isGlobalAdmin: boolean;
  };
}

export interface IRoleOptionDropDown {
  value: "all" | "admin" | "parent";
  label: string;
  description: string;
  icon: React.ReactNode;
}

export interface IOrganization {
  id: string;
  name: string;
  description: string;
  country: string;
  users: string[];
  location: string;
  pincode: string;
  status: string;
}

export interface IStudentDetails {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentEmail: string;
  dateOfBirth: string;
}

export interface IStudentFormData {
  id: string;
  admissionNumber: string;
  admissionDate: string;
  name: string;
  classId: string;
  rollNumber: string;
  dateOfBirth: string;
  parentEmail: string;
  city: string;
  state: string;
  address: string;
  parentName?: string;
  phoneNumber?: string;
}

export interface ICreateUpdateStudentModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  formData: IStudentFormData;
  isEditStudent: boolean;
  currentStep: number;
  isParentExist: boolean;
  isLoadingAddStudent: boolean;
  isLoadingUpdateStudent: boolean;
  onClose: () => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<IStudentFormData>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectOption {
  id: string | number;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
