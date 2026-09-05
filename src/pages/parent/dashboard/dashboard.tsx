import SectionHeader from "../../../components/section-header";

const ParentDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Dashboard" description="A quick overview of your child's school activity" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Upcoming Homework</h2>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Fees</h2>
          <p className="text-3xl font-bold">1</p>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
