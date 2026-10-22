import { useState } from "react";
import { useParams } from "react-router-dom";

import SectionHeader from "@/components/section-header";
import { useCan } from "@/context/tenant-context";
import { PermissionKey } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeHeadsTab from "./tabs/fee-heads-tab";
import FeeStructuresTab from "./tabs/fee-structures-tab";
import LedgerTab from "./tabs/ledger-tab";
import StudentFeesTab from "./tabs/student-fees-tab";
import DefaultersTab from "./tabs/defaulters-tab";
import CollectionsTab from "./tabs/collections-tab";

const TABS: { key: string; label: string; anyOf: PermissionKey[] }[] = [
  { key: "structures", label: "Fee Structures", anyOf: ["fees.setup"] },
  { key: "heads", label: "Fee Heads", anyOf: ["fees.setup"] },
  { key: "students", label: "Student Fees & Payments", anyOf: ["fees.collect", "fees.reverse", "fees.concession"] },
  { key: "ledger", label: "Payment Ledger", anyOf: ["fees.collect", "fees.reports"] },
  { key: "defaulters", label: "Defaulters", anyOf: ["fees.reports"] },
  { key: "collections", label: "Collections", anyOf: ["fees.reports"] },
];

const AdminFees = () => {
  const { organizationId = "" } = useParams();
  const can = useCan();
  const tabs = TABS.filter((tab) => can(...tab.anyOf));
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "");

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader title="Fees" description="Fee setup, collection and reports" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 border-b border-gray-200">
        <TabsList className="overflow-x-auto">
          {tabs.map((tab) => (
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
      {activeTab === "defaulters" && <DefaultersTab organizationId={organizationId} />}
      {activeTab === "collections" && <CollectionsTab organizationId={organizationId} />}
    </div>
  );
};

export default AdminFees;
