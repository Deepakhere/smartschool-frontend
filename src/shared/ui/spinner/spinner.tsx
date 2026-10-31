// centres in its box via normal flow, never fixed or absolute, so it never covers the sidebar or header
const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="h-8 w-8 rounded-full border-2 spinner-ring animate-spin"></div>
    </div>
  );
};

export default Spinner;
