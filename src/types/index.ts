// every role a person can hold in a school, as the web app names them
export type AccountRole = "admin" | "parent" | "teacher" | "accountant" | "staff";

// mirrors smartschool-backend/core/access/permissions.js
export type PermissionKey =
  | "school.settings"
  | "people.manage"
  | "dashboard.view"
  | "academics.manage"
  | "students.view"
  | "students.manage"
  | "attendance.mark"
  | "homework.manage"
  | "leave.review"
  | "exams.manage"
  | "exams.marks"
  | "notices.manage"
  | "calendar.manage"
  | "ptm.manage"
  | "fees.collect"
  | "fees.reports"
  | "fees.reverse"
  | "fees.concession"
  | "fees.setup"
  | "certificates.issue";

import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

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
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
  attachmentURL: string;
  audience?: INoticeAudience;
  pinned?: boolean;
  isRead?: boolean;
}

export interface INotification {
  id: string;
  organizationId?: string;
  type: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  readAt: string | null;
  createdAt: string;
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

export interface ILeaveRequest {
  id: string;
  studentId: { id: string; name: string } | string;
  requestedByUserId: { id: string; name: string; email: string } | string;
  classId: string;
  sectionId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  attachmentURL: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  decidedBy?: string;
  decisionNote?: string;
  decidedAt?: string;
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
  refreshToken?: string;
  name: string;
  isPlatformAdmin?: boolean;
  preferences?: IUserPreferences;
  avatar?: IUserAvatar;
}

export interface IForgotPassword {
  email: string;
}

export interface IAddUser {
  id: number;
  username: string;
  email: string;
  role: AccountRole;
}

export interface IAddUserValue {
  name: string;
  email: string;
  role: AccountRole;
}

export interface IAllUserDetails {
  id: string;
  name: string;
  email: string;
  role: AccountRole | "student";
  // "suspended" is this school's; pending and active are the account's
  status: "pending" | "active" | "suspended" | "inactive";
}

export interface FormData {
  fullname: string;
  email: string;
  role: AccountRole;
}

export interface RoleOption {
  value: AccountRole;
  label: string;
  description: string;
  icon: ReactNode;
}

export interface ICreateUpdateUserModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  form: UseFormReturn<FormData>;
  roleOptions: RoleOption[];
  isEditUser: boolean;
  isLoadingAddUserDetail: boolean;
  isLoadingUpdateUserDetail?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface IUpdateUserValue {
  id: string;
  name: string;
  email: string;
}

export interface IUserPreferences {
  theme: "light" | "dark";
  locale: "en" | "hi";
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface IUserAvatar {
  publicId: string;
  url: string;
}

export interface IUserDetailResponse {
  id: string;
  email: string;
  token: string;
  isPlatformAdmin?: boolean;
  preferences?: IUserPreferences;
  avatar?: IUserAvatar;
}

export interface IRoleOptionDropDown {
  value: "all" | AccountRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export type IBillingStatus = "trialing" | "grace" | "active" | "suspended_unpaid";

export interface IBillingTierRef {
  id: string;
  label: string;
  priceInrPaise: number;
}

export interface IBillingSummary {
  organizationId: string;
  billingStatus: IBillingStatus;
  trialEndsAt: string | null;
  graceEndsAt: string | null;
  paidThrough: string | null;
  studentLimit: number | null;
  activeStudentCount: number;
  tier: IBillingTierRef | null;
  amountDuePaise: number | null;
  lastInvoice?: {
    tierId: string;
    tierLabel: string;
    studentCountAtBilling: number;
    amountPaise: number;
    markedPaidAt: string;
    markedPaidBy: string;
  } | null;
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
  logo?: {
    publicId: string;
    url: string;
  };
  // differs per school
  myRole?: AccountRole | "student" | null;
  myPermissions?: PermissionKey[];
  // modules the school's package includes; unset = every module
  myModules?: ModuleKey[];
  letterhead?: ILetterhead;
}

// printed on certificates under the school name; every line optional
export interface ILetterhead {
  tagline: string;
  phone: string;
  email: string;
  website: string;
  board: string;
  registrationNo: string;
  affiliationNo: string;
  udiseCode: string;
  principalName: string;
  principalTitle: string;
}

export type CertificateType = "bonafide" | "transfer";
export type CertificateGender = "male" | "female" | "other";

export interface ICertificate {
  id: string;
  type: CertificateType;
  number: string;
  studentId: string;
  studentName: string;
  duplicates: number;
  issuedAt: string;
  issuedBy?: { id: string; name: string } | string;
}

export interface ICertificateDraft {
  student: {
    id: string;
    name: string;
    status: string;
    admissionNumber: string;
    dob: string | null;
    academicYearId: string | null;
    academicYear: string;
    className: string;
    sectionName: string;
  };
  answers: Partial<{
    gender: CertificateGender;
    parentName: string;
    fatherName: string;
    motherName: string;
    nationality: string;
    category: string;
    conduct: string;
  }>;
  records: {
    admissionDate: string | null;
    admissionClass: string;
    subjects: string[];
    workingDays: number;
    daysPresent: number;
    lastExam: string;
    promotion: string;
    feesStatus: string;
    duePaise: number;
  } | null;
  existingTc: { id: string; number: string; issuedAt: string } | null;
  letterhead: ILetterhead & { name: string; address: string; logoUrl: string | null };
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
  sectionCount?: number;
  studentCount?: number;
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
  studentCount?: number;
}

export interface ISubject {
  id: string;
  name: string;
  code: string;
  academicYearId: string;
  type: string;
  status: string;
  applicableClassIds?: string[];
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

export interface IPTMEvent {
  id: string;
  academicYearId: string;
  title: string;
  date: string;
  mode: "onsite" | "online";
  venue?: string;
  defaultMeetingLink?: string;
  sectionIds: string[];
  slotDurationMins: number;
  status: string;
  createdAt: string;
}

export interface IPTMSlot {
  id: string;
  ptmEventId: string;
  teacherUserId: { id: string; name: string; email: string } | string;
  sectionId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  meetingLink?: string;
  status: string;
}

export interface IPTMBooking {
  id: string;
  ptmEventId: string;
  slotId: IPTMSlot | string;
  studentId: { id: string; name: string; admissionNumber: string } | string;
  parentUserId: string;
  status: string;
  parentNote?: string;
  teacherNote?: string;
}

export interface IGradingBand {
  grade: string;
  minPercent: number;
  maxPercent: number;
  gradePoint: number;
}

export interface IGradingScheme {
  id: string;
  name: string;
  bands: IGradingBand[];
  passPercent: number;
  // exams that grade with it
  examCount?: number;
}

export interface IExam {
  id: string;
  academicYearId: string;
  name: string;
  term?: string;
  type: string;
  startDate: string;
  endDate: string;
  classIds: { id: string; name: string }[];
  gradingSchemeId: { id: string; name: string } | string;
  status: string;
  publishedAt?: string;
  progress?: IExamProgress;
}

// where an exam stands, worked out by the server from its subjects and marks
export type ExamStage = "setup" | "marks" | "ready" | "published";

export interface IExamProgress {
  classes: number;
  classesWithSubjects: number;
  subjects: number;
  // marks a fully entered exam holds: each subject times the students of its class
  expected: number;
  entered: number;
  verified: number;
  stage: ExamStage;
}

export interface IExamOverviewSubject extends IExamSubject {
  expected: number;
  entered: number;
  verified: number;
}

export interface IExamOverview {
  item: IExam & { progress: IExamProgress };
  classes: { id: string; name: string; students: number; subjects: IExamOverviewSubject[] }[];
}

export interface IExamSubject {
  id: string;
  examId: string;
  classId: { id: string; name: string } | string;
  subjectId: { id: string; name: string; code: string } | string;
  examDate?: string;
  maxMarks: number;
  passMarks: number;
  hasPractical: boolean;
  practicalMaxMarks: number;
}

export interface IMarks {
  id: string;
  examSubjectId: string;
  studentId: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  isAbsent: boolean;
  status: string;
}

export interface IMarksSheetItem {
  student: { id: string; name: string; rollNumber?: string };
  marks: IMarks | null;
}

export interface IResultSubjectRow {
  subjectId: { id: string; name: string; code: string } | string;
  obtained: number;
  max: number;
  isAbsent: boolean;
  grade: string | null;
  gradePoint: number | null;
}

export interface IResult {
  id: string;
  academicYearId: string;
  examId: { id: string; name: string; term?: string; type: string; startDate: string } | string;
  studentId: string;
  classId: string;
  sectionId?: string;
  subjects: IResultSubjectRow[];
  totals: { obtained: number; max: number; percentage: number };
  grade: string | null;
  gpa: number | null;
  rankInClass?: number;
  rankInSection?: number;
  promotionStatus: "pass" | "fail" | "pending";
  version: number;
  status: string;
  publishedAt: string;
}

export interface IFeeHead {
  id: string;
  name: string;
  code: string;
  category: string;
  isRefundable: boolean;
}

export interface IFeeStructure {
  id: string;
  academicYearId: string;
  name: string;
  classIds: { id: string; name: string }[];
  sectionIds: { id: string; name: string }[];
  items: { feeHeadId: { id: string; name: string; code: string }; amount: number }[];
  installments: { label: string; dueDate: string; amount: number }[];
  lateFee?: { amount: number; graceDays: number };
  version: number;
  status: string;
  // active students in its classes who have no fees for its year yet
  unassignedCount: number;
}

export interface IFeeInstallmentBalance {
  label: string;
  dueDate: string;
  netAmount: number;
  // a late fee already added into netAmount
  lateFeeAmount?: number;
  paidAmount: number;
  balance: number;
}

export interface IPayment {
  id: string;
  academicYearId: string;
  studentId: { id: string; name: string; admissionNumber: string } | string;
  studentFeeId: string;
  entryType: "payment" | "reversal";
  amount: number;
  allocations: { installmentLabel: string; amount: number }[];
  method: string;
  instrumentRef?: string;
  receiptNumber: string;
  reversalOfPaymentId?: string;
  paidAt: string;
  remarks?: string;
}

export interface IFeeConcession {
  id: string;
  reason: string;
  amount: number;
  approvedBy?: string;
  approvedAt: string;
}

export interface IStudentFeeSummary {
  studentFeeId: string;
  academicYearId: string;
  studentId?: string;
  studentName?: string;
  installments: IFeeInstallmentBalance[];
  concessions?: IFeeConcession[];
  totalNet: number;
  totalPaid: number;
  totalBalance: number;
  payments: IPayment[];
}

export interface IStudentDetails {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentEmail: string;
  dateOfBirth: string;
}

export interface IAdmissionPerson {
  name?: string;
  phone?: string;
  email?: string;
  occupation?: string;
}

export interface IPostalAddress {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// the admission form's details beyond the basics; all optional on the server
export interface IStudentAdmissionDetails {
  gender?: "male" | "female" | "other" | "";
  bloodGroup?: string;
  aadhaarNumber?: string;
  category?: string;
  religion?: string;
  motherTongue?: string;
  nationality?: string;
  permanentAddress?: IPostalAddress;
  father?: IAdmissionPerson;
  mother?: IAdmissionPerson;
  previousSchool?: { name?: string; lastClass?: string; tcNumber?: string };
}

// what the add and edit endpoints take
export interface IStudentFormData extends IStudentAdmissionDetails {
  id?: string;
  admissionNumber: string;
  admissionDate: string;
  name: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
  dateOfBirth: string;
  city: string;
  state: string;
  address: string;
  pincode?: string;
  // the parent who signs in; left out on an edit of a student nobody signs in for
  parentEmail?: string;
  parentName?: string;
  phoneNumber?: string;
  relationshipType?: "FATHER" | "MOTHER" | "GUARDIAN";
}

export interface IStudentEnrollment {
  academicYearId: string;
  classId: { id: string; name: string } | null;
  sectionId: { id: string; name: string } | null;
  rollNumber: string;
}

export interface IPromotionCandidate {
  student: { id: string; name: string; admissionNumber: string };
  rollNumber: string;
  result: {
    examName: string;
    examType: string;
    promotionStatus: "pass" | "fail" | "pending";
    percentage: number | null;
    grade: string | null;
  } | null;
}

export type PromotionAction = "promote" | "detain" | "transfer" | "withdraw";

export interface IPromotionDecisionResult {
  studentId: string;
  success: boolean;
  message?: string;
}

export interface IEnrollmentHistoryEntry {
  id: string;
  academicYearId: { id: string; name: string } | null;
  classId: { id: string; name: string } | null;
  sectionId: { id: string; name: string } | null;
  rollNumber: string;
  status: "ACTIVE" | "PROMOTED" | "DETAINED" | "TRANSFERRED" | "WITHDRAWN";
  joinedOn: string;
  leftOn?: string;
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
  date?: string;
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
  dateOfBirth?: string;
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
  // shown in the open menu when there is nothing to pick yet
  emptyText?: string;
  // set by FormControl, so the field label names the select
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export interface IEmailLog {
  id: string;
  recipientEmail: string;
  type: string;
  subject: string;
  status: "queued" | "sent" | "failed" | "skipped";
  reason?: string;
  createdAt: string;
}

export type CalendarEntryType = "holiday" | "half_day" | "event";

export interface ICalendarEntry {
  id: string;
  title: string;
  type: CalendarEntryType;
  date: string;
  recurring: boolean;
  startDate: string;
  dayOfWeek?: number;
}

export interface ICalendarAutoItem {
  title: string;
  type: "exam" | "birthday";
  who?: "student" | "staff";
  date: string;
}

export interface ICalendarMonth {
  entries: ICalendarEntry[];
  examDays: ICalendarAutoItem[];
  birthdays: ICalendarAutoItem[];
}

export interface ICalendarRule {
  id: string;
  title: string;
  type: CalendarEntryType;
  date: string;
  recurrence?: { frequency: "weekly"; dayOfWeek: number };
}

export interface ITimetableSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  subjectId: { id: string; name: string; code: string } | null;
  teacherUserId: { id: string; name: string; email: string } | null;
  sectionId: { id: string; name: string } | null;
  classId: { id: string; name: string } | null;
}

// fee desk reports (amounts in paise)
export interface IFeeDefaulter {
  studentId: string;
  studentFeeId: string;
  overdueAmount: number;
  outstandingAmount: number;
  overdueInstallments: { label: string; dueDate: string; balance: number }[];
  oldestDueDate: string;
  daysOverdue: number;
  student: {
    id: string;
    name: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    guardian: { name: string; phoneNumber: string; email: string } | null;
  } | null;
}

// every paged list endpoint answers in this shape (smartschool-backend/core/http/pagination.js)
export interface Pagination {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Paged<T> {
  rows: T[];
  pagination: Pagination;
}

export interface IFeeDefaultersResult extends Paged<IFeeDefaulter> {
  asOf: string;
  summary: { students: number; overdueAmount: number; outstandingAmount: number };
}

export interface IFeeCollectionSummary {
  from: string;
  to: string;
  totals: { received: number; reversed: number; net: number; payments: number; reversals: number };
  byDay: { date: string; amount: number; count: number }[];
  byMethod: { method: string; amount: number; count: number }[];
  byClass: { classId: string | null; className: string; amount: number; students: number }[];
}

export type ModuleKey =
  | "attendance"
  | "homework"
  | "timetable"
  | "leave"
  | "exams"
  | "fees"
  | "onlinePayments"
  | "notices"
  | "calendar"
  | "ptm"
  | "certificates";
