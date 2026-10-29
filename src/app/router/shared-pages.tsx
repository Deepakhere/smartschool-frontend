import { ReactNode } from "react";

import { PermissionGate } from "@/entities/session";
import { ModuleGate } from "@/widgets/module-gate";
import { SHARED_PAGES } from "@/shared/config/shared-pages";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminClasses from "@/pages/admin/classes";
import AdminStudents from "@/pages/admin/students";
import StudentForm from "@/pages/admin/students/student-form";
import AdminPromotion from "@/pages/admin/promotion";
import AdminTeachers from "@/pages/admin/teachers";
import AdminNotices from "@/pages/admin/notices";
import AdminPTM from "@/pages/admin/ptm";
import AdminFees from "@/pages/admin/fees";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";
import AdminCertificates from "@/pages/admin/certificates";

const PAGE_ELEMENTS: Record<string, ReactNode> = {
  "school-dashboard": <AdminDashboard />,
  fees: <AdminFees />,
  classes: <AdminClasses />,
  "students/*": <AdminStudents />,
  admissions: <StudentForm />,
  promotion: <AdminPromotion />,
  "certificates/*": <AdminCertificates />,
  teachers: <AdminTeachers />,
  notices: <AdminNotices />,
  "school-ptm": <AdminPTM />,
  "results/*": <AdminReports />,
  "settings/*": <AdminSettings />,
};

export const sharedRoutes = (except: string[] = []) =>
  SHARED_PAGES.filter((page) => !except.includes(page.path)).map((page) => ({
    path: page.path,
    element: (
      <PermissionGate anyOf={page.anyOf}>
        {page.module ? (
          <ModuleGate module={page.module}>{PAGE_ELEMENTS[page.path]}</ModuleGate>
        ) : (
          PAGE_ELEMENTS[page.path]
        )}
      </PermissionGate>
    ),
  }));
