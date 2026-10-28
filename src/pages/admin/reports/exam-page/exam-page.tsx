import { useNavigate, useParams } from "react-router-dom";

import { useAreaBase } from "@/entities/session/model/tenant-context";
import { usePageHeader } from "@/shared/hooks";
import { IExamOverviewSubject } from "@/entities/exam/model/types";
import ExamDetail from "../components/exam/exam-detail";
import { useGetExamOverview } from "@/entities/exam/api/exams-service";

// one exam on its own page; the header's back arrow returns to the exam list
const ExamPage = () => {
  const { organizationId = "", examId = "" } = useParams();
  const navigate = useNavigate();
  const areaBase = useAreaBase();
  const toList = () => navigate(`${areaBase}/results?tab=exams`);
  // the same query the page itself reads, so the name costs no extra request
  const examName = useGetExamOverview(organizationId, examId).data?.item.name;
  usePageHeader({ title: examName ?? "Exam", onBack: toList });

  const enterMarks = (subject: IExamOverviewSubject) => {
    const classId = typeof subject.classId === "object" ? subject.classId.id : subject.classId;
    navigate(`${areaBase}/results?tab=marks&exam=${subject.examId}&class=${classId}&subject=${subject.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <ExamDetail organizationId={organizationId} examId={examId} onDeleted={toList} enterMarks={enterMarks} />
    </div>
  );
};

export default ExamPage;
