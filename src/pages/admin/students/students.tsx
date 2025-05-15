import { Routes, Route } from "react-router-dom";

import StudentsList from "./student-list";
import StudentDetails from "./student-details";

const StudentsContainer = () => {
  return (
    <Routes>
      <Route index={true} element={<StudentsList />} />
      <Route path="detail/:studentId" element={<StudentDetails />} />
    </Routes>
  );
};

export default StudentsContainer;
