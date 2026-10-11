const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

// amounts are stored in paise on the server
export const formatMoney = (paise: number): string => inr.format((paise || 0) / 100);
