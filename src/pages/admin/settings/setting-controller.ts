import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const useSettingController = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (location.pathname.includes("/settings/add-user")) {
      setSelectedIndex(1);
    } else if (location.pathname.includes("/settings/profile")) {
      setSelectedIndex(0);
    }
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    if (index === 0) {
      navigate(`/${organizationId}/admin/settings/profile`);
    } else {
      navigate(`/${organizationId}/admin/settings/add-user`);
    }
  };
  return {
    selectedIndex,
    handleTabChange,
  };
};

export default useSettingController;
