import { useState } from "react";
import { useParams } from "react-router-dom";

import SectionHeader from "@/components/section-header";
import { useCurrentRole } from "@/context/tenant-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeHeadsTab from "./tabs/fee-heads-tab";
import FeeStructuresTab from "./tabs/fee-structures-tab";
import LedgerTab from "./tabs/ledger-tab";
import StudentFeesTab from "./tabs/student-fees-tab";
import DefaultersTab from "./tabs/defaulters-tab";
import CollectionsTab from "./tabs/collections-tab";

// fee setup is the school admin's; the fee desk (accountant) sees collection and reports
const TABS = [
  { key: "structures", label: "Fee Structures", adminOnly: true },
  { key: "heads", label: "Fee Heads", adminOnly: true },
  { key: "students", label: "Student Fees & Payments" },
  { key: "ledger", label: "Payment Ledger" },
  { key: "defaulters", label: "Defaulters" },
  { key: "collections", label: "Collections" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const AdminFees = () => {
  const { organizationId = "" } = useParams();
  const isFeeDesk = useCurrentRole() === "accountant";
  const tabs = TABS.filter((tab) => !(isFeeDesk && "adminOnly" in tab));
  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0].key);

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader title="Fees" description="Manage fee heads, structures, student assignments and payment collection" />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="mb-6 border-b border-gray-200">
        <TabsList className="overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!isFeeDesk && activeTab === "structures" && <FeeStructuresTab organizationId={organizationId} />}
      {!isFeeDesk && activeTab === "heads" && <FeeHeadsTab organizationId={organizationId} />}
      {activeTab === "students" && <StudentFeesTab organizationId={organizationId} />}
      {activeTab === "ledger" && <LedgerTab organizationId={organizationId} />}
      {activeTab === "defaulters" && <DefaultersTab organizationId={organizationId} />}
      {activeTab === "collections" && <CollectionsTab organizationId={organizationId} />}
    </div>
  );
};

export default AdminFees;
