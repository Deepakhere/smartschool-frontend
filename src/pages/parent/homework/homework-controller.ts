import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetMyChildren } from "../ptm/service/my-children-service";
import { useGetHomeworkForStudent } from "./service/homework-service";

export const useHomeworkController = () => {
  const { t } = useTranslation();
  const { organizationId = "" } = useParams();

  const [studentId, setStudentId] = useState("");

  const children = useGetMyChildren(organizationId);
  const homework = useGetHomeworkForStudent(organizationId, studentId);

  useEffect(() => {
    if (!studentId && children.data?.items?.length) {
      setStudentId(children.data.items[0].studentId.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.data]);

  return {
    t,
    children: children.data?.items || [],
    studentId,
    setStudentId,
    homeworkList: homework.data?.items || [],
    isLoading: homework.isLoading,
  };
};
