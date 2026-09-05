import { ReactNode } from "react";

export type NoticeAudienceScope = "SCHOOL" | "ROLE" | "CLASS" | "SECTION";

export interface INoticeAudience {
  scope: NoticeAudienceScope;
  roles: string[];
  classIds: string[];
  sectionIds: string[];
}

export interface INotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  attachmentURL: string;
  audience?: INoticeAudience;
  pinned?: boolean;
}

export interface ICreateNoticeRequest {
  title: string;
  content: string;
  type: string;
  date?: string;
  attachment?: File | null;
  audience?: INoticeAudience;
}

export interface IHomework {
  id: string;
  title: string;
  description: string;
  classId: { id: string; name: string } | string;
  sectionId: { id: string; name: string } | string;
  subjectId: { id: string; name: string; code: string } | string;
  assignedDate: string;
  dueDate: string;
  status: string;
  attachmentURL: string | null;
  createdAt: string;
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
  role: "admin" | "parent" | "teacher";
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
  role: "admin" | "parent" | "teacher";
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
  role: "admin" | "parent" | "teacher";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface RoleOption {
  value: "admin" | "parent" | "teacher";
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
  isEditingSelf?: boolean;
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
  role: "admin" | "parent" | "teacher";
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
  role: "admin" | "parent" | "teacher";
  permissions: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    isGlobalAdmin: boolean;
  };
}

export interface IRoleOptionDropDown {
  value: "all" | "admin" | "parent" | "teacher";
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
  address: string;
  pincode: string;
  status: string;
}

export interface ICreateOrganizationValue {
  name: string;
  address: string;
  pincode: string;
  description?: string;
}

export interface IAcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;
}

export interface IClass {
  id: string;
  name: string;
  academicYearId: string;
  numericLevel?: number;
  sequence?: number;
  status: string;
}

export interface ISection {
  id: string;
  name: string;
  classId: string;
  academicYearId: string;
  classTeacherId?: { id: string; name: string; email: string } | null;
  roomNumber?: string;
  capacity?: number;
  status: string;
}

export interface ISubject {
  id: string;
  name: string;
  code: string;
  academicYearId: string;
  type: string;
  status: string;
}

export interface ITeacherAssignment {
  id: string;
  teacherUserId: { id: string; name: string; email: string };
  academicYearId: string;
  classId: { id: string; name: string };
  sectionId: { id: string; name: string };
  subjectId?: { id: string; name: string; code: string } | null;
  assignmentRole: "SUBJECT_TEACHER" | "CLASS_TEACHER";
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
  academicYearId: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
  dateOfBirth: string;
  parentEmail: string;
  city: string;
  state: string;
  address: string;
  parentName?: string;
  phoneNumber?: string;
}

export interface IStudentEnrollment {
  academicYearId: string;
  classId: { id: string; name: string } | null;
  sectionId: { id: string; name: string } | null;
  rollNumber: string;
}

export interface IGuardian {
  id: string;
  parentUserId: { id: string; name: string; email: string; phoneNumber: string; status: string };
  relationshipType: "FATHER" | "MOTHER" | "GUARDIAN" | "OTHER";
  isPrimaryGuardian: boolean;
  isEmergencyContact: boolean;
  canPickup: boolean;
  communicationPreference: string[];
  status: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface IAttendanceRecord {
  id: string;
  studentId: { id: string; name: string } | string;
  status: AttendanceStatus;
  reason?: string;
}

export interface IAttendanceSession {
  id: string;
  sectionId: string;
  date: string;
  status: string;
  summary: { present: number; absent: number; late: number; excused: number; total: number };
}

export interface IStaffProfile {
  id: string;
  userId: string;
  employeeCode?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  dateOfJoining?: string;
  address?: string;
  status: string;
}

export interface ITeacherDirectoryEntry {
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: string;
  staffProfile: IStaffProfile | null;
}

export interface IAddGuardianValue {
  parentEmail: string;
  parentName?: string;
  phoneNumber?: string;
  relationshipType: string;
  isPrimaryGuardian: boolean;
  isEmergencyContact: boolean;
  canPickup: boolean;
}

export interface ICreateUpdateStudentModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  organizationId: string;
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
