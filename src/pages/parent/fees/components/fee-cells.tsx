import { Button } from "@/shared/ui/kit/button";
import { IFeeInstallmentBalance, IPayment } from "@/entities/fee";
import { formatMoney } from "@/shared/lib";
import type { InstallmentColumnActions, PaymentColumnActions } from "../fees-columns";

export const BalanceCell = ({ item, actions }: { item: IFeeInstallmentBalance; actions: InstallmentColumnActions }) => (
  <span className={item.balance > 0 ? "text-red-600" : "text-green-600"}>
    {formatMoney(item.balance)}
    {actions.canPayOnline && item.balance > 0 && (
      <Button
        variant="link"
        size="sm"
        className="ml-2"
        loading={actions.isPaying(item.label)}
        disabled={actions.isBusy}
        onClick={() => actions.pay(item.label)}
      >
        Pay
      </Button>
    )}
  </span>
);

export const ReceiptActions = ({
  payment,
  isEmailing,
  download,
  email,
}: PaymentColumnActions & { payment: IPayment }) => (
  <div className="flex gap-3">
    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => download(payment.id)}>
      Download
    </Button>
    <Button
      variant="link"
      size="sm"
      className="h-auto p-0 text-xs"
      disabled={isEmailing}
      onClick={() => email(payment.id)}
    >
      Email me
    </Button>
  </div>
);
