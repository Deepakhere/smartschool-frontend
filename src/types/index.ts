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
  role: "admin" | "parent";
}

export interface IForgotPassword {
  email: string;
}
