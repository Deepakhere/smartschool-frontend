import { useState } from "react";
import { useParams } from "react-router-dom";

import SectionHeader from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeHeadsTab from "./tabs/fee-heads-tab";
import FeeStructuresTab from "./tabs/fee-structures-tab";
import LedgerTab from "./tabs/ledger-tab";
import StudentFeesTab from "./tabs/student-fees-tab";

const TABS = [
  { key: "structures", label: "Fee Structures" },
  { key: "heads", label: "Fee Heads" },
  { key: "students", label: "Student Fees & Payments" },
  { key: "ledger", label: "Payment Ledger" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const AdminFees = () => {
  const { organizationId = "" } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>("structures");

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader title="Fees" description="Manage fee heads, structures, student assignments and payment collection" />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="mb-6 border-b border-gray-200">
        <TabsList className="overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeTab === "structures" && <FeeStructuresTab organizationId={organizationId} />}
      {activeTab === "heads" && <FeeHeadsTab organizationId={organizationId} />}
      {activeTab === "students" && <StudentFeesTab organizationId={organizationId} />}
      {activeTab === "ledger" && <LedgerTab organizationId={organizationId} />}
    </div>
  );
};

export default AdminFees;
