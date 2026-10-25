import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useModuleLock } from "@/components/module-gate";
import { useAreaBase, useCan, useTenant } from "@/context/tenant-context";
import { useDebouncedValue, useError, useExportRows, usePaging } from "@/hooks";
import { CertificateType, IAPIError, ICertificate } from "@/types";
import {
  downloadCertificatePdf,
  downloadCertificatesCsv,
  useCertificates,
  useDuplicateCertificate,
} from "../service/certificate-service";

const ITEM_LABEL = { one: "certificate", other: "certificates" };

const useCertificateRegisterController = () => {
  const { organizationId = "" } = useTenant();
  const navigate = useNavigate();
  const areaBase = useAreaBase();
  const { readOnly } = useModuleLock();
  const canIssue = useCan()("certificates.issue") && !readOnly;

  const { page, pageSize, setPage, setPageSize } = usePaging();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<CertificateType | "all">("all");
  const filters = {
    search: useDebouncedValue(search.trim(), 300) || undefined,
    type: type === "all" ? undefined : type,
  };
  const list = useCertificates(organizationId, page, pageSize, filters);
  const duplicate = useDuplicateCertificate(organizationId);
  useError({ mutation: duplicate });
  const total = list.data?.pagination.totalItems ?? 0;

  const { openExport, exportDialog } = useExportRows({
    total,
    itemLabel: ITEM_LABEL,
    download: (limit) => downloadCertificatesCsv(organizationId, filters, limit),
  });

  const download = async (certificate: ICertificate) => {
    try {
      await downloadCertificatePdf(organizationId, certificate);
    } catch (error) {
      toast.error((error as IAPIError)?.response?.Error?.message || "Could not download the certificate.");
    }
  };

  return {
    rows: list.data?.rows ?? [],
    isLoading: list.isLoading,
    error: list.isError ? list.error : null,
    retry: () => list.refetch(),
    pagination: { page, pageSize, total, onPageChange: setPage, onPageSizeChange: setPageSize },
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    type,
    setType: (value: CertificateType | "all") => {
      setType(value);
      setPage(1);
    },
    itemLabel: ITEM_LABEL,
    canIssue,
    download,
    duplicate: canIssue ? (certificate: ICertificate) => duplicate.mutate(certificate) : undefined,
    duplicatingId: duplicate.isPending ? duplicate.variables?.id : undefined,
    goToStudents: () => navigate(`${areaBase}/students`),
    openExport,
    exportDialog,
  };
};

export default useCertificateRegisterController;
