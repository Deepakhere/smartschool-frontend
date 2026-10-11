import logo from "@/icons/logo.png";

// full-viewport loading overlay - reserved for the app's own boot-time session
// check (AuthProvider) and the org picker's initial load. Every other loading
// state in the app is a normal in-page Spinner, never this one.
const LogoSpinner = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-white">
      <div className="logo-breathe h-16 w-16">
        <img src={logo} alt="Opscul Logo" className="h-full w-full object-contain dark:invert" />
      </div>
    </div>
  );
};

export default LogoSpinner;
