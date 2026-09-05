// use when a WHOLE page's content isn't ready yet (e.g. dashboard, a full-page
// detail view) — not for a single card/table's data. Covers exactly the content
// area (its nearest positioned ancestor is <main> in Layout), so it never
// touches the sidebar or header, only the section that's actually loading.
// For a table/card that's already rendered and just needs a loading state
// inside it, use the plain Spinner component instead.
const PageLoader = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
      <div className="h-10 w-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
