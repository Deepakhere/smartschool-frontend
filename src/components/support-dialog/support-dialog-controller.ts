import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAreaBase } from "@/context/tenant-context";
import { useError } from "@/hooks";
import { defaultNewSupportRequest, NewSupportRequestValues, newSupportRequestSchema, useCreateSupportRequest } from "@/pages/support";

const useSupportDialogController = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { organizationId = "" } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const areaBase = useAreaBase();
  const create = useCreateSupportRequest(organizationId);
  useError({ mutation: create });

  const form = useForm<NewSupportRequestValues>({ resolver: zodResolver(newSupportRequestSchema), defaultValues: defaultNewSupportRequest });
  useEffect(() => {
    if (open) form.reset(defaultNewSupportRequest);
  }, [open, form]);

  // the page they were on, for debugging
  const submit = form.handleSubmit((values) =>
    create.mutate(
      { ...values, page: pathname },
      {
        onSuccess: (request) => {
          toast.success(`Request #${request.number} sent. We'll reply here and by email.`);
          onClose();
          navigate(`${areaBase}/support/${request._id}`);
        },
      }
    )
  );

  return { form, submit, isSending: create.isPending };
};

export default useSupportDialogController;
