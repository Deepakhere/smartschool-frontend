import { useNavigate, useSearchParams } from "react-router-dom";

import { useAreaBase } from "@/context/tenant-context";
import { SelectOption } from "@/types";
import ExamList from "../components/exam/exam-list";

interface ExamsTabProps {
  organizationId: string;
  academicYearId?: string;
  classOptions: SelectOption[];
}

// the exam list; an exam opens on its own page
const ExamsTab = ({ organizationId, academicYearId, classOptions }: ExamsTabProps) => {
  const navigate = useNavigate();
  const areaBase = useAreaBase();
  const [, setParams] = useSearchParams();

  return (
    <ExamList
      organizationId={organizationId}
      academicYearId={academicYearId}
      classOptions={classOptions}
      openExam={(examId) => navigate(`${areaBase}/results/exams/${examId}`)}
      openSchemes={() => setParams({ tab: "schemes" })}
    />
  );
};

export default ExamsTab;
