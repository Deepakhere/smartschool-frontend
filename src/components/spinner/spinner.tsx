// centers within whatever box it's placed in (a table card, a page section, etc.)
// via normal flow — no fixed/absolute positioning, so it never covers the sidebar,
// header, or unrelated parts of the page
const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
