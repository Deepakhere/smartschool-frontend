import { useEffect } from "react";
import toast from "react-hot-toast";

const TOAST_ID = "network-status";

const showOffline = () =>
  toast.error("You're offline. Check your internet connection.", {
    id: TOAST_ID,
    duration: Infinity,
  });

const useNetworkToast = () => {
  useEffect(() => {
    if (!navigator.onLine) showOffline();
    const onOnline = () => toast.success("You're back online.", { id: TOAST_ID, duration: 3000 });
    window.addEventListener("offline", showOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", showOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);
};

export default useNetworkToast;
